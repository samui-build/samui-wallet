import {
  type Base64EncodedDataResponse,
  decompileTransactionMessageFetchingLookupTables,
  getBase64Encoder,
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
  type Signature,
  type SignaturesMap,
  type TransactionMessageBytes,
} from '@solana/kit'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

export async function fetchBase64Transaction(rpc: SolanaClient['rpc'], signature: Signature) {
  const found = await rpc.getTransaction(signature, { encoding: 'base64', maxSupportedTransactionVersion: 0 }).send()

  if (!found) {
    throw new Error(`Error fetching transaction with signature: ${signature} `)
  }

  return found
}

export async function fetchAndDeserializeTransaction(rpc: SolanaClient['rpc'], signature: Signature) {
  const found = await fetchBase64Transaction(rpc, signature)

  const decoded = decodeTransactionFromBase64(found.transaction)
  const compiledTransactionMessage = decodeToCompiledTransactionMessage(decoded)
  const deCompiledTransactionMessage = await decompileTransactionMessageFetchingLookupTables(
    compiledTransactionMessage,
    rpc,
  )

  return {
    compiledTransactionMessage,
    deCompiledTransactionMessage,
    decoded,
    found,
  }
}

export interface DecodedTransaction {
  messageBytes: TransactionMessageBytes
  signatures: SignaturesMap
}

function decodeTransactionFromBase64(transaction: Base64EncodedDataResponse): Readonly<DecodedTransaction> {
  const transactionBytes = getBase64Encoder().encode(transaction[0])

  return getTransactionDecoder().decode(transactionBytes)
}

function decodeToCompiledTransactionMessage(decoded: DecodedTransaction) {
  return getCompiledTransactionMessageDecoder().decode(decoded.messageBytes)
}
