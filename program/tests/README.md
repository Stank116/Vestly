# Program Tests

Add Anchor integration tests here after Rust, Solana CLI, and Anchor CLI are installed.

Recommended end-to-end test flow:

1. Create a dev/test USDC mint.
2. Create client and contributor token accounts.
3. Mint test USDC to the client.
4. Call `initialize_contract`.
5. Call `add_milestone`.
6. Call `fund_escrow`.
7. Call `submit_milestone` as contributor.
8. Call `release_payment` as client.
9. Assert the contributor token account received the milestone amount.
