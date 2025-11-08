import type { Account } from '@workspace/db/entity/account'

import { useMemo } from 'react'

export function useSortAccounts(accounts: Account[]) {
  return useMemo(
    () => [...accounts].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)),
    [accounts],
  )
}
