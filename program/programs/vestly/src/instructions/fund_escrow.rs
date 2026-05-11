use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::{
    errors::VestlyError,
    events::EscrowFunded,
    state::{Contract, ContractStatus},
};

#[derive(Accounts)]
pub struct FundEscrow<'info> {
    #[account(
        mut,
        has_one = client,
        constraint = contract.vault == escrow_vault.key()
    )]
    pub contract: Account<'info, Contract>,

    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        mut,
        constraint = client_token_account.owner == client.key(),
        constraint = client_token_account.mint == contract.mint
    )]
    pub client_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = escrow_vault.key() == contract.vault,
        constraint = escrow_vault.mint == contract.mint
    )]
    pub escrow_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<FundEscrow>, amount_usdc: u64) -> Result<()> {
    require!(amount_usdc > 0, VestlyError::InvalidAmount);

    let contract = &mut ctx.accounts.contract;
    require!(
        contract.status == ContractStatus::Active,
        VestlyError::InvalidMilestoneStatus
    );
    require!(
        contract.allocated_usdc == contract.total_usdc,
        VestlyError::MilestonesNotFullyAllocated
    );

    let next_funded = contract
        .funded_usdc
        .checked_add(amount_usdc)
        .ok_or(VestlyError::MathOverflow)?;

    require!(
        next_funded <= contract.total_usdc,
        VestlyError::EscrowFundingExceedsContract
    );

    let transfer_accounts = Transfer {
        from: ctx.accounts.client_token_account.to_account_info(),
        to: ctx.accounts.escrow_vault.to_account_info(),
        authority: ctx.accounts.client.to_account_info(),
    };

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_accounts,
        ),
        amount_usdc,
    )?;

    contract.funded_usdc = next_funded;

    emit!(EscrowFunded {
        contract: contract.key(),
        vault: contract.vault,
        amount_usdc,
        funded_usdc: contract.funded_usdc,
    });

    Ok(())
}
