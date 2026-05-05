import { type Address, fetchJsonParsedAccount } from '@solana/kit'
import type { SolanaClient } from './solana-client.ts'

export interface FetchAccountOptions {
  address: Address
  throwOnError?: boolean
}

export type FetchedAccount = Awaited<ReturnType<typeof fetchJsonParsedAccount>>
export type ExistingFetchedAccount = Extract<FetchedAccount, { exists: true }>

export async function fetchAccount(
  client: SolanaClient,
  { address, throwOnError = true }: FetchAccountOptions,
): Promise<FetchedAccount> {
  const result = await fetchJsonParsedAccount(client.rpc, address)

  // Throw an error if the account is not found, ensuring the return type is never null
  if (!result?.exists && throwOnError) {
    throw new Error(`Account info not found for address: ${address}`)
  }

  return result
}
