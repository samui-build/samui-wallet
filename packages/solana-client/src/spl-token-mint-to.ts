import type { Address, Signature, TransactionSigner } from '@solana/kit'
import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getMintToCheckedInstruction } from '@solana-program/token-2022'
import { createGetOrCreateAtaInstruction } from './create-get-or-create-ata-instruction.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenMintToOptions {
  amount: bigint
  decimals: number
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  tokenProgram?: Address
  transactionSigner: TransactionSigner
}

export interface SplTokenMintToResult {
  ata: Address
  signature: Signature
}

export async function splTokenMintTo(
  client: SolanaClient,
  {
    amount,
    latestBlockhash,
    mint,
    decimals,
    tokenProgram = TOKEN_PROGRAM_ADDRESS,
    transactionSigner,
  }: SplTokenMintToOptions,
): Promise<SplTokenMintToResult> {
  const [ata, createAtaInstruction] = await createGetOrCreateAtaInstruction({
    mint,
    owner: transactionSigner.address,
    tokenProgram,
    transactionSigner,
  })

  const mintToInstruction = getMintToCheckedInstruction(
    {
      amount,
      decimals,
      mint,
      mintAuthority: transactionSigner,
      token: ata,
    },
    { programAddress: tokenProgram },
  )

  const signature = await signAndSendTransaction(client, {
    instructions: [createAtaInstruction, mintToInstruction],
    latestBlockhash,
    transactionSigner,
  })

  return { ata, signature }
}
