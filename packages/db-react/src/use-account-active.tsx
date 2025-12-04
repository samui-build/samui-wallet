import type { Account } from '@workspace/db/account/account'
import { accountGetActive } from '@workspace/db/account/account-get-active'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useAccountActive() {
  const data = useRootLoaderData()

  if (!data) {
    throw new Error('Root loader not called.')
  }

  const account = useLiveQuery<Account | undefined, Account | null>(() => accountGetActive(db), [], data.activeAccount)

  if (!account) {
    throw new Error('No active account set.')
  }

  return account
}
