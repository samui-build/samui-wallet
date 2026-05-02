import {
  type Address,
  compileTransaction,
  compileTransactionMessage,
  getBase64Decoder,
  getBase64EncodedWireTransaction,
  getCompiledTransactionMessageEncoder,
  type TransactionMessageBytesBase64,
} from '@solana/kit'
import { tryCatch } from '@workspace/core/try-catch'
import { getSimulatedSolBalanceChanges } from './get-simulated-sol-balance-changes.ts'
import { getSimulatedTokenBalanceChanges } from './get-simulated-token-balance-changes.ts'
import { maybeBigInt } from './parse-rpc-number.ts'
import { createPreparedTransactionMessage, type PreparedTransactionOptions } from './prepared-transaction-message.ts'
import type {
  RawParsedAccount,
  RawSimulateTransactionValue,
  SimulatePreparedTransactionResult,
} from './simulate-prepared-transaction-types.ts'
import type { SolanaClient } from './solana-client.ts'

export type SimulatePreparedTransactionOptions = PreparedTransactionOptions

export type {
  SimulatePreparedTransactionBaseResult,
  SimulatePreparedTransactionResult,
  SimulatePreparedTransactionSolBalanceChange,
  SimulatePreparedTransactionTokenBalanceChange,
} from './simulate-prepared-transaction-types.ts'

export async function simulatePreparedTransaction(
  client: SolanaClient,
  input: SimulatePreparedTransactionOptions,
): Promise<SimulatePreparedTransactionResult> {
  const { latestBlockhash, transactionMessage } = await createPreparedTransactionMessage(client, input)
  const compiledTransactionMessage = compileTransactionMessage(transactionMessage)
  const transaction = compileTransaction(transactionMessage)
  const base64EncodedWireTransaction = getBase64EncodedWireTransaction(transaction)
  const accountAddresses = compiledTransactionMessage.staticAccounts
  const [feeResult, preAccountsResult, response] = await Promise.all([
    tryCatch(getFeeForMessage(client, compiledTransactionMessage)),
    tryCatch(getParsedAccounts(client, accountAddresses)),
    client.rpc
      .simulateTransaction(base64EncodedWireTransaction, {
        accounts: {
          addresses: accountAddresses,
          encoding: 'base64',
        },
        commitment: 'confirmed',
        encoding: 'base64',
        innerInstructions: true,
        replaceRecentBlockhash: false,
        sigVerify: false,
      })
      .send(),
  ])
  const value = response.value as RawSimulateTransactionValue
  const fee = feeResult.error ? undefined : feeResult.data
  const preAccounts = preAccountsResult.error ? undefined : preAccountsResult.data
  const postAccounts = preAccounts ? value.accounts : undefined
  const solBalanceChanges = getSimulatedSolBalanceChanges({
    accountAddresses,
    postAccounts,
    postBalances: value.postBalances,
    preAccounts: preAccounts ?? [],
    preBalances: value.preBalances,
  })
  const tokenBalanceChanges = getSimulatedTokenBalanceChanges({
    accountAddresses,
    postAccounts,
    postTokenBalances: value.postTokenBalances,
    preAccounts: preAccounts ?? [],
    preTokenBalances: value.preTokenBalances,
  })
  const baseResult = {
    fee: maybeBigInt(value.fee) ?? fee,
    latestBlockhash,
    logs: value.logs ?? [],
    solBalanceChanges,
    tokenBalanceChanges,
    unitsConsumed: maybeBigInt(value.unitsConsumed),
  }

  if (value.err) {
    return {
      ...baseResult,
      error: value.err,
      status: 'failure',
    }
  }

  return {
    ...baseResult,
    error: null,
    status: 'success',
  }
}

async function getFeeForMessage(
  client: SolanaClient,
  compiledTransactionMessage: ReturnType<typeof compileTransactionMessage>,
) {
  const base64EncodedMessage = getBase64Decoder().decode(
    getCompiledTransactionMessageEncoder().encode(compiledTransactionMessage),
  ) as TransactionMessageBytesBase64
  const response = await client.rpc
    .getFeeForMessage(base64EncodedMessage, {
      commitment: 'confirmed',
    })
    .send()

  return maybeBigInt(response.value ?? undefined)
}

async function getParsedAccounts(client: SolanaClient, accountAddresses: Address[]) {
  if (!accountAddresses.length) {
    return []
  }

  const response = await client.rpc
    .getMultipleAccounts(accountAddresses, {
      commitment: 'confirmed',
      encoding: 'base64',
    })
    .send()

  return response.value as (RawParsedAccount | null)[]
}
