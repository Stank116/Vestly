import { AnchorProvider, BN, Idl, Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, TransactionSignature } from '@solana/web3.js';
import { connection, PROGRAM_ID, USDC_MINT } from './solana';

type WalletLike = {
  publicKey: PublicKey | null;
  signTransaction?: AnchorProvider['wallet']['signTransaction'];
  signAllTransactions?: AnchorProvider['wallet']['signAllTransactions'];
};

export type OnChainMilestoneInput = {
  title: string;
  description?: string;
  usdc: number;
};

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);
const USDC_DECIMALS = 1_000_000;

function toUsdcAmount(usdc: number) {
  return new BN(Math.round(usdc * USDC_DECIMALS));
}

async function loadIdl(): Promise<Idl> {
  const response = await fetch('/idl/vestly.json');
  if (!response.ok) {
    throw new Error('Missing /idl/vestly.json. Build and copy Anchor IDL first.');
  }
  return response.json();
}

async function getProgram(wallet: WalletLike) {
  if (!PROGRAM_ID) {
    throw new Error('Missing NEXT_PUBLIC_PROGRAM_ID');
  }
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error('Connect a wallet that can sign transactions');
  }

  const provider = new AnchorProvider(connection, wallet as AnchorProvider['wallet'], {
    commitment: 'confirmed',
  });

  return new (Program as any)(await loadIdl(), PROGRAM_ID, provider) as Program;
}

export function isOnChainConfigured() {
  return Boolean(PROGRAM_ID);
}

export function getContractPda(input: {
  client: PublicKey;
  contributor: PublicKey;
  contractId: BN;
}) {
  if (!PROGRAM_ID) throw new Error('Missing NEXT_PUBLIC_PROGRAM_ID');

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('contract'),
      input.client.toBuffer(),
      input.contributor.toBuffer(),
      input.contractId.toArrayLike(Buffer, 'le', 8),
    ],
    PROGRAM_ID
  );
}

export function getMilestonePda(contract: PublicKey, index: number) {
  if (!PROGRAM_ID) throw new Error('Missing NEXT_PUBLIC_PROGRAM_ID');

  return PublicKey.findProgramAddressSync(
    [Buffer.from('milestone'), contract.toBuffer(), Buffer.from([index])],
    PROGRAM_ID
  );
}

export function getAssociatedTokenAddress(input: {
  mint: PublicKey;
  owner: PublicKey;
}) {
  return PublicKey.findProgramAddressSync(
    [input.owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), input.mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
}

export function getEscrowVaultAddress(contractPda: PublicKey) {
  return getAssociatedTokenAddress({
    mint: USDC_MINT,
    owner: contractPda,
  });
}

export async function initializeContractOnChain(input: {
  wallet: WalletLike;
  contributor: PublicKey;
  title: string;
  totalUsdc: number;
  contractId: BN;
}): Promise<{ signature: TransactionSignature; contractPda: PublicKey }> {
  const program = await getProgram(input.wallet);
  const [contractPda] = getContractPda({
    client: input.wallet.publicKey!,
    contributor: input.contributor,
    contractId: input.contractId,
  });
  const escrowVault = getEscrowVaultAddress(contractPda);

  const signature = await (program as any).methods
    .initializeContract(input.contractId, input.title, toUsdcAmount(input.totalUsdc))
    .accounts({
      contract: contractPda,
      escrowVault,
      client: input.wallet.publicKey,
      contributor: input.contributor,
      usdcMint: USDC_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return { signature, contractPda };
}

export async function addMilestoneOnChain(input: {
  wallet: WalletLike;
  contractPda: PublicKey;
  index: number;
  title: string;
  description?: string;
  usdc: number;
}) {
  const program = await getProgram(input.wallet);
  const [milestonePda] = getMilestonePda(input.contractPda, input.index);

  const signature = await (program as any).methods
    .addMilestone(
      input.title,
      input.description ?? '',
      toUsdcAmount(input.usdc)
    )
    .accounts({
      contract: input.contractPda,
      milestone: milestonePda,
      client: input.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return { signature, milestonePda };
}

export async function fundEscrowOnChain(input: {
  wallet: WalletLike;
  contractPda: PublicKey;
  usdc: number;
}) {
  const program = await getProgram(input.wallet);
  const escrowVault = getEscrowVaultAddress(input.contractPda);
  const clientTokenAccount = getAssociatedTokenAddress({
    mint: USDC_MINT,
    owner: input.wallet.publicKey!,
  });

  return (program as any).methods
    .fundEscrow(toUsdcAmount(input.usdc))
    .accounts({
      contract: input.contractPda,
      client: input.wallet.publicKey,
      clientTokenAccount,
      escrowVault,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export async function submitMilestoneOnChain(input: {
  wallet: WalletLike;
  contractPda: PublicKey;
  milestoneIndex: number;
}) {
  const program = await getProgram(input.wallet);
  const [milestonePda] = getMilestonePda(input.contractPda, input.milestoneIndex);

  return (program as any).methods
    .submitMilestone()
    .accounts({
      contract: input.contractPda,
      milestone: milestonePda,
      contributor: input.wallet.publicKey,
    })
    .rpc();
}

export async function releaseMilestoneOnChain(input: {
  wallet: WalletLike;
  contractPda: PublicKey;
  contributor: PublicKey;
  milestoneIndex: number;
}) {
  const program = await getProgram(input.wallet);
  const [milestonePda] = getMilestonePda(input.contractPda, input.milestoneIndex);
  const escrowVault = getEscrowVaultAddress(input.contractPda);
  const contributorTokenAccount = getAssociatedTokenAddress({
    mint: USDC_MINT,
    owner: input.contributor,
  });

  return (program as any).methods
    .releasePayment()
    .accounts({
      contract: input.contractPda,
      milestone: milestonePda,
      client: input.wallet.publicKey,
      contributor: input.contributor,
      escrowVault,
      contributorTokenAccount,
      usdcMint: USDC_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function createFundedContractOnChain(input: {
  wallet: WalletLike;
  contributor: PublicKey;
  title: string;
  contractId?: BN;
  milestones: OnChainMilestoneInput[];
}) {
  const totalUsdc = input.milestones.reduce((sum, item) => sum + item.usdc, 0);
  const contractId = input.contractId ?? new BN(Date.now());
  const initialized = await initializeContractOnChain({
    wallet: input.wallet,
    contributor: input.contributor,
    title: input.title,
    totalUsdc,
    contractId,
  });

  const addedMilestones = [];
  for (const [index, milestone] of input.milestones.entries()) {
    addedMilestones.push(
      await addMilestoneOnChain({
        wallet: input.wallet,
        contractPda: initialized.contractPda,
        index,
        title: milestone.title,
        description: milestone.description,
        usdc: milestone.usdc,
      })
    );
  }

  const fundSignature = await fundEscrowOnChain({
    wallet: input.wallet,
    contractPda: initialized.contractPda,
    usdc: totalUsdc,
  });

  return {
    contractId,
    contractPda: initialized.contractPda,
    initializeSignature: initialized.signature,
    milestoneSignatures: addedMilestones.map((item) => item.signature),
    fundSignature,
  };
}
