import { assertAccountExists } from '@solana/kit'
import type { FetchedAccount } from './fetch-account.ts'

export type AccountTokenType = 'token-account' | 'token-mint' | 'token-unknown'
export function getAccountTokenType({ account }: { account: FetchedAccount }): AccountTokenType {
  assertAccountExists(account)
  if (
    account.data.parsedAccountMeta?.program !== 'spl-token' &&
    account.data.parsedAccountMeta?.program !== 'spl-token-2022'
  ) {
    return 'token-unknown'
  }
  if (account.data.parsedAccountMeta?.type === 'account') {
    return 'token-account'
  }
  if (account.data.parsedAccountMeta?.type === 'mint') {
    return 'token-mint'
  }
  return 'token-unknown'
}
