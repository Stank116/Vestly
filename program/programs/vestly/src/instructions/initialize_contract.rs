use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::{
    errors::VestlyError,
    events::ContractInitialized,
    state::{Contract, ContractStatus},
};

#[derive(Accounts)]
#[instruction(contract_id: u64)]
pub struct InitializeContract<'info> {
    #[account(
        init,
        payer = client,
        space = Contract::LEN,
        seeds = [
            b"contract",
            client.key().as_ref(),
            contributor.key().as_ref(),
            contract_id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub contract: Account<'info, Contract>,

    #[account(
        init,
        payer = client,
        associated_token::mint = usdc_mint,
        associated_token::authority = contract
    )]
    pub escrow_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub client: Signer<'info>,

    /// CHECK: This is the wallet that can submit milestones and receive USDC.
    pub contributor: UncheckedAccount<'info>,

    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeContract>,
    contract_id: u64,
    title: String,
    total_usdc: u64,
) -> Result<()> {
    require!(total_usdc > 0, VestlyError::InvalidAmount);
    require!(
        title.as_bytes().len() <= Contract::MAX_TITLE_LEN,
        VestlyError::TitleTooLong
    );
    require!(
        ctx.accounts.client.key() != ctx.accounts.contributor.key(),
        VestlyError::InvalidContributor
    );

    let contract = &mut ctx.accounts.contract;
    contract.contract_id = contract_id;
    contract.client = ctx.accounts.client.key();
    contract.contributor = ctx.accounts.contributor.key();
    contract.mint = ctx.accounts.usdc_mint.key();
    contract.vault = ctx.accounts.escrow_vault.key();
    contract.title = title;
    contract.total_usdc = total_usdc;
    contract.allocated_usdc = 0;
    contract.funded_usdc = 0;
    contract.released_usdc = 0;
    contract.milestone_count = 0;
    contract.status = ContractStatus::Active;
    contract.bump = ctx.bumps.contract;

    emit!(ContractInitialized {
        contract: contract.key(),
        client: contract.client,
        contributor: contract.contributor,
        mint: contract.mint,
        vault: contract.vault,
        total_usdc,
    });

    Ok(())
}
