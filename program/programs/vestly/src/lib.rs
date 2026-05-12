use anchor_lang::prelude::*;

pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("GWGc6ZSvpwQ6VTUE7KHRi2pfddh9Ua16PQYE9yj9aS14");

#[program]
pub mod vestly {
    use super::*;

    pub fn initialize_contract(
        ctx: Context<InitializeContract>,
        contract_id: u64,
        title: String,
        total_usdc: u64,
    ) -> Result<()> {
        initialize_contract::handler(ctx, contract_id, title, total_usdc)
    }

    pub fn add_milestone(
        ctx: Context<AddMilestone>,
        title: String,
        description: String,
        amount_usdc: u64,
    ) -> Result<()> {
        add_milestone::handler(ctx, title, description, amount_usdc)
    }

    pub fn fund_escrow(ctx: Context<FundEscrow>, amount_usdc: u64) -> Result<()> {
        fund_escrow::handler(ctx, amount_usdc)
    }

    pub fn submit_milestone(ctx: Context<SubmitMilestone>) -> Result<()> {
        submit_milestone::handler(ctx)
    }

    pub fn release_payment(ctx: Context<ReleasePayment>) -> Result<()> {
        release_payment::handler(ctx)
    }
}
