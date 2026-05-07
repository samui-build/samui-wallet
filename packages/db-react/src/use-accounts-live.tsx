import type { Account } from '@workspace/db/account/account'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAppContext } from './use-app-context.tsx'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useAccountsLive() {
  const ctx = useAppContext()
  const data = useRootLoaderData()
  if (!data?.accounts) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Account[], Account[]>(() => accountFindMany(ctx), [ctx], data.accounts)
}
