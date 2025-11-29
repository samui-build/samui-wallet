import type { Account } from './account.ts'
import type { AccountInternal } from './account-internal.ts'
import { accountSchema } from './account-schema.ts'

export function accountSanitizer(internal: AccountInternal): Account {
  return accountSchema.parse(internal)
}
