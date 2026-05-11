use anchor_lang::prelude::*;

#[account]
pub struct Contract {
    pub contract_id: u64,
    pub client: Pubkey,
    pub contributor: Pubkey,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub title: String,
    pub total_usdc: u64,
    pub allocated_usdc: u64,
    pub funded_usdc: u64,
    pub released_usdc: u64,
    pub milestone_count: u8,
    pub status: ContractStatus,
    pub bump: u8,
}

impl Contract {
    pub const MAX_TITLE_LEN: usize = 80;

    pub const LEN: usize = 8
        + 8
        + 32
        + 32
        + 32
        + 32
        + (4 + Self::MAX_TITLE_LEN)
        + 8
        + 8
        + 8
        + 8
        + 1
        + 1
        + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ContractStatus {
    Active,
    Completed,
}
