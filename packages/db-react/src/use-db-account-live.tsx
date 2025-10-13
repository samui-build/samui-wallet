import type { Account } from '@workspace/db/entity/account'

import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useDbAccountLive() {
  return useLiveQuery<Account[], Account[]>(() => db.accounts.orderBy('name').toArray(), [], [])
}
