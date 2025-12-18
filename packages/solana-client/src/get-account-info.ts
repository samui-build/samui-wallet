import type { AccountInfoBase, AccountInfoWithJsonData, Address } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export type ParsedJsonData = Extract<AccountInfoWithJsonData['data'], Readonly<{ parsed: unknown }>>

export type AccountInfoWithParsedData = {
  data: ParsedJsonData
}

export type GetAccountInfoResult = {
  value: (AccountInfoBase & AccountInfoWithParsedData) | null
}

export async function getAccountInfo(client: SolanaClient, { address }: { address: Address }) {
  const result = await client.rpc.getAccountInfo(address, { encoding: 'jsonParsed' }).send()
  if (!result) {
    throw new Error(`Error getting account info ${address}`)
  }
  return result
}
