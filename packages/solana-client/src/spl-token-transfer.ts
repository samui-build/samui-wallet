import type { Address, Signature, TransactionSigner } from '@solana/kit'
import { getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { createGetOrCreateAtaInstruction } from './create-get-or-create-ata-instruction.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenTransferOptions {
  amount: bigint
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  tokenProgram?: Address
  transactionSigner: TransactionSigner
}

export interface SplTokenTransferResult {
  ata: Address
  signature: Signature
}

export async function splTokenTransfer(
  client: SolanaClient,
  { amount, latestBlockhash, mint, tokenProgram = TOKEN_PROGRAM_ADDRESS, transactionSigner }: SplTokenTransferOptions,
): Promise<SplTokenTransferResult> {
  const [ata, createAtaInstruction] = await createGetOrCreateAtaInstruction({
    mint,
    owner: transactionSigner.address,
    tokenProgram,
    transactionSigner,
  })

  const mintToInstruction = getMintToInstruction({
    amount,
    mint,
    mintAuthority: transactionSigner,
    token: ata,
  })

  const signature = await signAndSendTransaction(client, {
    instructions: [createAtaInstruction, mintToInstruction],
    latestBlockhash,
    transactionSigner,
  })

  return { ata, signature }
}
