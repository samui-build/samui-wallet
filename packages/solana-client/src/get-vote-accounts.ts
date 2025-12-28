import { tryCatch } from '@workspace/core/try-catch'
import type { SolanaClient } from './solana-client.ts'

export async function getVoteAccounts(client: SolanaClient) {
  const { data: accounts, error } = await tryCatch(client.rpc.getVoteAccounts().send())
  if (error) {
    console.log(error)
    throw new Error('Error fetching vote accounts')
  }

  return accounts.current ?? []
}
