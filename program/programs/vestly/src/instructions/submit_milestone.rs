use anchor_lang::prelude::*;

use crate::{
    errors::VestlyError,
    events::MilestoneSubmitted,
    state::{Contract, Milestone, MilestoneStatus},
};

#[derive(Accounts)]
pub struct SubmitMilestone<'info> {
    #[account(has_one = contributor)]
    pub contract: Account<'info, Contract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key()
    )]
    pub milestone: Account<'info, Milestone>,

    pub contributor: Signer<'info>,
}

pub fn handler(ctx: Context<SubmitMilestone>) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    require!(
        milestone.status == MilestoneStatus::Locked,
        VestlyError::InvalidMilestoneStatus
    );

    milestone.status = MilestoneStatus::Submitted;
    milestone.submitted_at = Clock::get()?.unix_timestamp;

    emit!(MilestoneSubmitted {
        contract: ctx.accounts.contract.key(),
        milestone: milestone.key(),
        index: milestone.index,
        contributor: ctx.accounts.contributor.key(),
    });

    Ok(())
}
