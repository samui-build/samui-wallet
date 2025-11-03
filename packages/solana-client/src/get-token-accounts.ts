import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { TOKEN_2022_PROGRAM_ADDRESS } from '@solana-program/token-2022'
import { getTokenAccountsForProgramId } from './get-token-accounts-for-program-id.ts'
import type { SolanaClient } from './solana-client.ts'

export type GetTokenAccountsResult = Awaited<ReturnType<typeof getTokenAccounts>>

export async function getTokenAccounts(client: SolanaClient, { address }: { address: string }) {
  return Promise.all([
    getTokenAccountsForProgramId(client, { address, programId: TOKEN_PROGRAM_ADDRESS }),
    getTokenAccountsForProgramId(client, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
  ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts.value, ...token2022Accounts.value])
}
