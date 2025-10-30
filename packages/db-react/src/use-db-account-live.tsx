import type { Account } from '@workspace/db/entity/account'

import { db } from '@workspace/db/db'
import { dbAccountFindMany } from '@workspace/db/db-account-find-many'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbAccountLive() {
  return useLiveQuery<Account[], Account[]>(() => dbAccountFindMany(db), [], [])
}
