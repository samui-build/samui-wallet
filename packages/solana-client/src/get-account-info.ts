import type { AccountInfoBase, AccountInfoWithJsonData, Address } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

// This extracts only the parsed data object from the union type
export type ParsedJsonData = Extract<AccountInfoWithJsonData['data'], { parsed: unknown }>

// This creates a new type for the account info where the `data` property is guaranteed to be the parsed object
export type AccountInfoWithParsedData = AccountInfoBase & {
  data: ParsedJsonData
}

export async function getAccountInfo(client: SolanaClient, { address }: { address: Address }) {
  const result = await client.rpc.getAccountInfo(address, { encoding: 'jsonParsed' }).send()

  // Throw an error if the account is not found, ensuring the return type is never null
  if (!result.value) {
    throw new Error(`Account info not found for address: ${address}`)
  }

  // Cast the result to our refined type
  return result.value as AccountInfoWithParsedData
}
