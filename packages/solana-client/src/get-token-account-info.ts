import { type Address, fetchJsonParsedAccount, type JsonParsedTokenAccount } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from './constants.ts'
import type { SolanaClient } from './solana-client.ts'
import type { SplTokenBurnTokenProgram } from './spl-token-burn.ts'

export type ParsedTokenAccountData = JsonParsedTokenAccount & {
  parsedAccountMeta?: {
    type?: string
  }
}

export type TokenAccountInfo = Awaited<ReturnType<typeof getTokenAccountInfo>>
export type TokenAccountInfoWithTokenProgram = TokenAccountInfo & {
  tokenProgram: SplTokenBurnTokenProgram | undefined
}

export function isParsedTokenAccountData(data: unknown): data is ParsedTokenAccountData {
  return !!data && typeof data === 'object' && !(data instanceof Uint8Array) && 'mint' in data && 'tokenAmount' in data
}

export function getTokenAccountProgramAddress({
  account,
}: {
  account: TokenAccountInfo
}): SplTokenBurnTokenProgram | undefined {
  if (!account.exists || account.data instanceof Uint8Array) {
    return undefined
  }

  switch (account.data.parsedAccountMeta?.program) {
    case 'spl-token':
      return TOKEN_PROGRAM_ADDRESS
    case 'spl-token-2022':
      return TOKEN_2022_PROGRAM_ADDRESS
    default:
      return undefined
  }
}

export async function getTokenAccountInfo(client: SolanaClient, { address }: { address: Address }) {
  const parsed = await fetchJsonParsedAccount(client.rpc, address, { commitment: 'confirmed' })

  if (!parsed?.exists) {
    throw new Error(`Error fetching token account ${address}`)
  }

  return parsed
}
