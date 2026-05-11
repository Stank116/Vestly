use anchor_lang::prelude::*;

#[account]
pub struct Milestone {
    pub contract: Pubkey,
    pub index: u8,
    pub title: String,
    pub description: String,
    pub amount_usdc: u64,
    pub status: MilestoneStatus,
    pub submitted_at: i64,
    pub released_at: i64,
    pub bump: u8,
}

impl Milestone {
    pub const MAX_TITLE_LEN: usize = 80;
    pub const MAX_DESCRIPTION_LEN: usize = 240;

    pub const LEN: usize = 8
        + 32
        + 1
        + (4 + Self::MAX_TITLE_LEN)
        + (4 + Self::MAX_DESCRIPTION_LEN)
        + 8
        + 1
        + 8
        + 8
        + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MilestoneStatus {
    Locked,
    Submitted,
    Released,
}
