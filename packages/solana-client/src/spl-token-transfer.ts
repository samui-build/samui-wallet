import type { Address, KeyPairSigner, Signature } from '@solana/kit'
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import { splTokenTransferInstructions } from './spl-token-transfer-instructions.ts'

export interface SplTokenTransferOptions {
  amount: bigint
  feePayerSigner: KeyPairSigner
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  tokenProgram?: Address
}

export interface SplTokenTransferResult {
  ata: Address
  signature: Signature
}

export async function splTokenTransfer(
  client: SolanaClient,
  { amount, feePayerSigner, latestBlockhash, mint, tokenProgram = TOKEN_PROGRAM_ADDRESS }: SplTokenTransferOptions,
): Promise<SplTokenTransferResult> {
  // const mintInfo = await fetchMint(client.rpc, mint)

  const [ata] = await findAssociatedTokenPda({
    mint,
    owner: feePayerSigner.address,
    tokenProgram,
  })

  const signature = await signAndSendTransaction(client, {
    feePayerSigner,
    instructions: splTokenTransferInstructions({ amount, ata, feePayerSigner, mint, tokenProgram }),
    latestBlockhash,
  })

  return { ata, signature }
}
