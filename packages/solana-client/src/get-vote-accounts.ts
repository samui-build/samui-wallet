import type { GetVoteAccountsApi } from '@solana/kit'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { SolanaClient } from './solana-client.ts'

export type GetCurrentVoteAccountsResult = ReturnType<GetVoteAccountsApi['getVoteAccounts']>['current']

export async function getVoteAccounts(client: SolanaClient): Promise<GetCurrentVoteAccountsResult> {
  const accounts = await tryCatchOrThrow(client.rpc.getVoteAccounts().send(), 'Error fetching vote accounts')

  return accounts.current ?? []
}
