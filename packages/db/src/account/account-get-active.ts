import type { Database } from '../database.ts'
import { settingGetValue } from '../setting/setting-get-value.ts'
import type { Account } from './account.ts'
import { accountSchema } from './account-schema.ts'

export async function accountGetActive(db: Database): Promise<Account> {
  const accountId = await settingGetValue(db, 'activeAccountId')
  const walletId = await settingGetValue(db, 'activeWalletId')

  if (!walletId || !accountId) {
    throw new Error('No active wallet or account set')
  }

  const account = await db.accounts.get(accountId)

  if (!account) {
    throw new Error('Active account not found')
  }

  if (account.walletId !== walletId) {
    throw new Error('Account wallet mismatch')
  }

  return accountSchema.parse(account)
}
