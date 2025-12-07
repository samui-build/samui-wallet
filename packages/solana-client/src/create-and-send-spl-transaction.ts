import { type Address, assertIsAddress, assertIsKeyPairSigner, type KeyPairSigner, type Signature } from '@solana/kit'
import { fetchMint, findAssociatedTokenPda } from '@solana-program/token'
import { createSplTransferInstructions } from './create-spl-transfer-instructions.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import { uiAmountToBigInt } from './ui-amount-to-big-int.ts'

export interface CreateAndSendSplTransactionOptions {
  amount: string
  decimals: number
  destination: Address
  feePayerSigner: KeyPairSigner
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
}

export async function createAndSendSplTransaction(
  client: SolanaClient,
  { amount, decimals, destination, latestBlockhash, mint, feePayerSigner }: CreateAndSendSplTransactionOptions,
): Promise<Signature> {
  assertIsAddress(destination)
  assertIsAddress(mint)
  assertIsKeyPairSigner(feePayerSigner)
  const mintInfo = await fetchMint(client.rpc, mint)

  const tokenProgram = mintInfo.programAddress
  const [sourceTokenAccount] = await findAssociatedTokenPda({
    mint: mint,
    owner: feePayerSigner.address,
    tokenProgram,
  })
  const [destinationTokenAccount] = await findAssociatedTokenPda({
    mint: mint,
    owner: destination,
    tokenProgram,
  })
  const destinationTokenAccountInfo = await client.rpc
    .getAccountInfo(destinationTokenAccount, { encoding: 'base64' })
    .send()

  return signAndSendTransaction(client, {
    feePayerSigner,
    instructions: createSplTransferInstructions({
      amount: uiAmountToBigInt(amount, decimals),
      decimals,
      destination,
      destinationTokenAccount,
      destinationTokenAccountExists: destinationTokenAccountInfo.value !== null,
      mint,
      sender: feePayerSigner,
      sourceTokenAccount,
      tokenProgram,
    }),
    latestBlockhash,
  })
}
