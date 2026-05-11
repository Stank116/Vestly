use anchor_lang::prelude::*;

#[error_code]
pub enum VestlyError {
    #[msg("Contract title is too long")]
    TitleTooLong,
    #[msg("Milestone description is too long")]
    DescriptionTooLong,
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Contributor must be different from the client")]
    InvalidContributor,
    #[msg("Milestone total exceeds the contract total")]
    MilestoneTotalExceedsContract,
    #[msg("Escrow funding exceeds the contract total")]
    EscrowFundingExceedsContract,
    #[msg("Milestone amounts must equal the contract total before funding")]
    MilestonesNotFullyAllocated,
    #[msg("Escrow has not been funded enough for this release")]
    EscrowNotFunded,
    #[msg("Milestone is not in the right status for this action")]
    InvalidMilestoneStatus,
    #[msg("Math overflow")]
    MathOverflow,
}
