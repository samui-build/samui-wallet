import type { Address } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export function getAccountInfo(client: SolanaClient, { address }: { address: Address }) {
  return client.rpc.getAccountInfo(address, { encoding: 'jsonParsed' }).send()
}
