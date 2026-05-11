use anchor_lang::prelude::*;

#[event]
pub struct ContractInitialized {
    pub contract: Pubkey,
    pub client: Pubkey,
    pub contributor: Pubkey,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub total_usdc: u64,
}

#[event]
pub struct MilestoneAdded {
    pub contract: Pubkey,
    pub milestone: Pubkey,
    pub index: u8,
    pub amount_usdc: u64,
}

#[event]
pub struct EscrowFunded {
    pub contract: Pubkey,
    pub vault: Pubkey,
    pub amount_usdc: u64,
    pub funded_usdc: u64,
}

#[event]
pub struct MilestoneSubmitted {
    pub contract: Pubkey,
    pub milestone: Pubkey,
    pub index: u8,
    pub contributor: Pubkey,
}

#[event]
pub struct PaymentReleased {
    pub contract: Pubkey,
    pub milestone: Pubkey,
    pub index: u8,
    pub contributor: Pubkey,
    pub amount_usdc: u64,
}
