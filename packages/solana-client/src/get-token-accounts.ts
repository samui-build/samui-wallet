import type { Address } from '@solana/kit'
import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { TOKEN_2022_PROGRAM_ADDRESS } from '@solana-program/token-2022'
import {
  type GetTokenAccountsForProgramIdResult,
  getTokenAccountsForProgramId,
} from './get-token-accounts-for-program-id.ts'
import type { SolanaClient } from './solana-client.ts'

export interface GetTokenAccountsOptions {
  address: Address
}

export type GetTokenAccountsResult = GetTokenAccountsForProgramIdResult['value']

export async function getTokenAccounts(
  client: SolanaClient,
  { address }: GetTokenAccountsOptions,
): Promise<GetTokenAccountsResult> {
  return Promise.all([
    getTokenAccountsForProgramId(client, { address, programId: TOKEN_PROGRAM_ADDRESS }),
    getTokenAccountsForProgramId(client, { address, programId: TOKEN_2022_PROGRAM_ADDRESS }),
  ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts.value, ...token2022Accounts.value])
}
