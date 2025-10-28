import type { Address, KeyPairSigner } from '@solana/kit'

import { fetchMint, findAssociatedTokenPda } from '@solana-program/token'

import type { SolanaClient } from './solana-client'

import { createSplTransferTransaction } from './create-spl-transfer-transaction'
import {
  address,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from './index'
import { tokenAmountToTransferAmount } from './utils'

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

  const destinationTokenAccountInfo = await client.rpc
    .getAccountInfo(destinationTokenAccount, { encoding: 'base64' })
    .send()

  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

  const transactionMessage = createSplTransferTransaction({
    amount: tokenAmountToTransferAmount(amount, decimals).toString(),
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
  // @ts-expect-error rpc clients are scoped to their cluster, we need to figure out how to handle this
  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    // @ts-expect-error TODO: Figure out "Property lastValidBlockHeight is missing in type TransactionDurableNonceLifetime but required in type"
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
