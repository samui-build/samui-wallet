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
import type { SolanaClient } from './solana-client.ts'
import { uiAmountToBigInt } from './ui-amount-to-big-int.ts'

export async function createAndSendSplTransaction(
  client: SolanaClient,
  {
    amount,
    decimals,
    destination,
    mint,
    sender,
  }: {
    amount: string
    decimals: number
    destination: string
    mint: Address | string
    sender: KeyPairSigner
  },
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

  const [destinationTokenAccountInfo, { value: latestBlockhash }] = await Promise.all([
    client.rpc.getAccountInfo(destinationTokenAccount, { encoding: 'base64' }).send(),
    client.rpc.getLatestBlockhash().send(),
  ])
  const transactionMessage = createSplTransferTransaction({
    amount: uiAmountToBigInt(amount, decimals).toString(),
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
