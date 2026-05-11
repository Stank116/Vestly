use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

use crate::{
    errors::VestlyError,
    events::PaymentReleased,
    state::{Contract, ContractStatus, Milestone, MilestoneStatus},
};

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(
        mut,
        has_one = client,
        has_one = contributor,
        constraint = contract.vault == escrow_vault.key()
    )]
    pub contract: Account<'info, Contract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key()
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(mut)]
    pub client: Signer<'info>,

    /// CHECK: This account is checked against `contract.contributor`.
    #[account(address = contract.contributor)]
    pub contributor: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = escrow_vault.key() == contract.vault,
        constraint = escrow_vault.owner == contract.key(),
        constraint = escrow_vault.mint == contract.mint
    )]
    pub escrow_vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = client,
        associated_token::mint = usdc_mint,
        associated_token::authority = contributor
    )]
    pub contributor_token_account: Account<'info, TokenAccount>,

    #[account(address = contract.mint)]
    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ReleasePayment>) -> Result<()> {
    require!(
        ctx.accounts.milestone.status == MilestoneStatus::Submitted,
        VestlyError::InvalidMilestoneStatus
    );

    let contract = &mut ctx.accounts.contract;
    let milestone = &mut ctx.accounts.milestone;
    let amount_usdc = milestone.amount_usdc;
    let available = contract
        .funded_usdc
        .checked_sub(contract.released_usdc)
        .ok_or(VestlyError::MathOverflow)?;

    require!(available >= amount_usdc, VestlyError::EscrowNotFunded);

    let contract_id = contract.contract_id.to_le_bytes();
    let signer_seeds: &[&[u8]] = &[
        b"contract",
        contract.client.as_ref(),
        contract.contributor.as_ref(),
        contract_id.as_ref(),
        &[contract.bump],
    ];

    let transfer_accounts = Transfer {
        from: ctx.accounts.escrow_vault.to_account_info(),
        to: ctx.accounts.contributor_token_account.to_account_info(),
        authority: contract.to_account_info(),
    };

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_accounts,
            &[signer_seeds],
        ),
        amount_usdc,
    )?;

    milestone.status = MilestoneStatus::Released;
    milestone.released_at = Clock::get()?.unix_timestamp;
    contract.released_usdc = contract
        .released_usdc
        .checked_add(amount_usdc)
        .ok_or(VestlyError::MathOverflow)?;

    if contract.released_usdc == contract.total_usdc {
        contract.status = ContractStatus::Completed;
    }

    emit!(PaymentReleased {
        contract: contract.key(),
        milestone: milestone.key(),
        index: milestone.index,
        contributor: contract.contributor,
        amount_usdc,
    });

    Ok(())
}
