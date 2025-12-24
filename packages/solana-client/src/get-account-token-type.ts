import type { AccountInfoWithParsedData } from './get-account-info.ts'

export type AccountTokenType = 'token-account' | 'token-mint' | 'token-unknown'
export function getAccountTokenType({
  accountData,
}: {
  accountData: AccountInfoWithParsedData['data']
}): AccountTokenType {
  if (accountData.program !== 'spl-token' && accountData.program !== 'spl-token-2022') {
    return 'token-unknown'
  }
  if (accountData.parsed.type === 'account') {
    return 'token-account'
  }
  if (accountData.parsed.type === 'mint') {
    return 'token-mint'
  }
  return 'token-unknown'
}
