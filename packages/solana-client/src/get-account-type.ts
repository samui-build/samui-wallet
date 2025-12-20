import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { BPF_LOADER, NATIVE_LOADER, SYSTEM_ACCOUNT } from './constants.ts'
import type { FetchedAccount } from './fetch-account.ts'
import { type AccountTokenType, getAccountTokenType } from './get-account-token-type.ts'

export type AccountType = AccountTokenType | 'not-found' | 'system' | 'system-program' | 'unknown'

export function getAccountType({ account }: { account?: FetchedAccount | undefined }): AccountType {
  if (!account?.exists) {
    return 'not-found'
  }
  switch (account.programAddress) {
    case TOKEN_2022_PROGRAM_ADDRESS:
    case TOKEN_PROGRAM_ADDRESS:
      return getAccountTokenType({ account })
    case BPF_LOADER:
      return 'system-program'
    case SYSTEM_ACCOUNT:
    case NATIVE_LOADER:
      return 'system'
    default:
      return 'unknown'
  }
}
