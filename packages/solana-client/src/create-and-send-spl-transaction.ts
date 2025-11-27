import {
  type Address,
  address,
  assertIsTransactionWithBlockhashLifetime,
  getSignatureFromTransaction,
  type KeyPairSigner,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { fetchMint, findAssociatedTokenPda } from '@solana-program/token'
import { createSplTransferTransaction } from './create-spl-transfer-transaction.ts'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'
import { uiAmountToBigInt } from './ui-amount-to-big-int.ts'

export interface CreateAndSendSplTransactionOptions {
  amount: string
  decimals: number
  destination: string
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address | string
  sender: KeyPairSigner
}

export async function createAndSendSplTransaction(
  client: SolanaClient,
  { amount, decimals, destination, latestBlockhash, mint, sender }: CreateAndSendSplTransactionOptions,
): Promise<string> {
  const mintInfo = await fetchMint(client.rpc, address(mint))

  const tokenProgram = mintInfo.programAddress
  const [sourceTokenAccount] = await findAssociatedTokenPda({
    mint: address(mint),
    owner: sender.address,
    tokenProgram,
  })
  const [destinationTokenAccount] = await findAssociatedTokenPda({
    mint: address(mint),
    owner: address(destination),
    tokenProgram,
  })
  const destinationTokenAccountInfo = await client.rpc
    .getAccountInfo(destinationTokenAccount, { encoding: 'base64' })
    .send()

  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))
  const transactionMessage = createSplTransferTransaction({
    amount: uiAmountToBigInt(amount, decimals),
    decimals,
    destination,
    destinationTokenAccount,
    destinationTokenAccountExists: destinationTokenAccountInfo.value !== null,
    latestBlockhash,
    mint,
    sender,
    sourceTokenAccount,
    tokenProgram,
  })

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
