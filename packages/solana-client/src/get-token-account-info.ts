import { type Address, fetchJsonParsedAccount } from '@solana/kit'
import type { SolanaClient } from './solana-client.ts'

export type TokenAccountInfo = ReturnType<typeof getTokenAccountInfo>
export async function getTokenAccountInfo(client: SolanaClient, { address }: { address: Address }) {
  const parsed = await fetchJsonParsedAccount(client.rpc, address, { commitment: 'confirmed' })

  if (!parsed) {
    throw new Error(`Error fetching token account ${address}`)
  }

  return parsed
}
