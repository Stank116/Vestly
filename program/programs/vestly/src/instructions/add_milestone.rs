use anchor_lang::prelude::*;

use crate::{
    errors::VestlyError,
    events::MilestoneAdded,
    state::{Contract, ContractStatus, Milestone, MilestoneStatus},
};

#[derive(Accounts)]
pub struct AddMilestone<'info> {
    #[account(mut, has_one = client)]
    pub contract: Account<'info, Contract>,

    #[account(
        init,
        payer = client,
        space = Milestone::LEN,
        seeds = [
            b"milestone",
            contract.key().as_ref(),
            &[contract.milestone_count],
        ],
        bump
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(mut)]
    pub client: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AddMilestone>,
    title: String,
    description: String,
    amount_usdc: u64,
) -> Result<()> {
    require!(amount_usdc > 0, VestlyError::InvalidAmount);
    require!(
        title.as_bytes().len() <= Milestone::MAX_TITLE_LEN,
        VestlyError::TitleTooLong
    );
    require!(
        description.as_bytes().len() <= Milestone::MAX_DESCRIPTION_LEN,
        VestlyError::DescriptionTooLong
    );
    require!(
        ctx.accounts.contract.status == ContractStatus::Active,
        VestlyError::InvalidMilestoneStatus
    );

    let contract = &mut ctx.accounts.contract;
    let next_allocated = contract
        .allocated_usdc
        .checked_add(amount_usdc)
        .ok_or(VestlyError::MathOverflow)?;

    require!(
        next_allocated <= contract.total_usdc,
        VestlyError::MilestoneTotalExceedsContract
    );

    let milestone = &mut ctx.accounts.milestone;
    milestone.contract = contract.key();
    milestone.index = contract.milestone_count;
    milestone.title = title;
    milestone.description = description;
    milestone.amount_usdc = amount_usdc;
    milestone.status = MilestoneStatus::Locked;
    milestone.submitted_at = 0;
    milestone.released_at = 0;
    milestone.bump = ctx.bumps.milestone;

    contract.allocated_usdc = next_allocated;
    contract.milestone_count = contract
        .milestone_count
        .checked_add(1)
        .ok_or(VestlyError::MathOverflow)?;

    emit!(MilestoneAdded {
        contract: contract.key(),
        milestone: milestone.key(),
        index: milestone.index,
        amount_usdc,
    });

    Ok(())
}
