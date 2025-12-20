import { type Address, fetchJsonParsedAccount } from '@solana/kit'
import type { SolanaClient } from './solana-client.ts'

export type FetchedAccount = Awaited<ReturnType<typeof fetchAccount>>

export async function fetchAccount(
  client: SolanaClient,
  { address, throwOnError = true }: { address: Address; throwOnError?: boolean },
) {
  const result = await fetchJsonParsedAccount(client.rpc, address)

  // Throw an error if the account is not found, ensuring the return type is never null
  if (!result?.exists && throwOnError) {
    throw new Error(`Account info not found for address: ${address}`)
  }

  return result
}
