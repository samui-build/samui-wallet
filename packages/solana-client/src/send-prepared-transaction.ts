import {
  assertIsTransactionWithBlockhashLifetime,
  getSignatureFromTransaction,
  type Signature,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import {
  createPreparedTransactionMessage,
  type PreparedTransaction,
  type PreparedTransactionOptions,
} from './prepared-transaction-message.ts'
import { type SimulatePreparedTransactionResult, simulatePreparedTransaction } from './simulate-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export type { PreparedTransaction }
export type SendPreparedTransactionOptions = PreparedTransactionOptions

export type SendSimulatedPreparedTransactionResult =
  | {
      signature: Signature
      simulation: Extract<SimulatePreparedTransactionResult, { status: 'success' }>
    }
  | {
      signature: undefined
      simulation: Extract<SimulatePreparedTransactionResult, { status: 'failure' }>
    }

export async function sendPreparedTransaction(
  client: SolanaClient,
  input: SendPreparedTransactionOptions,
): Promise<Signature> {
  const { transactionMessage } = await createPreparedTransactionMessage(client, input)
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}

export async function sendSimulatedPreparedTransaction(
  client: SolanaClient,
  input: SendPreparedTransactionOptions,
): Promise<SendSimulatedPreparedTransactionResult> {
  const simulation = await simulatePreparedTransaction(client, input)
  if (simulation.status === 'failure') {
    return {
      signature: undefined,
      simulation,
    }
  }

  const signature = await sendPreparedTransaction(client, {
    ...input,
    latestBlockhash: simulation.latestBlockhash,
  })

  return {
    signature,
    simulation,
  }
}
