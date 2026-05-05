import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { BPF_LOADER, BPF_LOADER_UPGRADEABLE, NATIVE_LOADER, SYSTEM_ACCOUNT } from './constants.ts'
import type { FetchedAccount } from './fetch-account.ts'
import { type AccountTokenType, getAccountTokenType } from './get-account-token-type.ts'

export type AccountType = AccountTokenType | 'not-found' | 'system' | 'system-program' | 'unknown'

export interface GetAccountTypeOptions {
  account?: FetchedAccount | undefined
}

export function getAccountType({ account }: GetAccountTypeOptions): AccountType {
  if (!account?.exists) {
    return 'not-found'
  }
  switch (account.programAddress) {
    case TOKEN_2022_PROGRAM_ADDRESS:
    case TOKEN_PROGRAM_ADDRESS:
      return getAccountTokenType({ account })
    case BPF_LOADER:
    case BPF_LOADER_UPGRADEABLE:
      return 'system-program'
    case SYSTEM_ACCOUNT:
    case NATIVE_LOADER:
      return 'system'
    default:
      return 'unknown'
  }
}
