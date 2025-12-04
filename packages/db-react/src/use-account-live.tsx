import type { Account } from '@workspace/db/account/account'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useAccountLive({ walletId }: { walletId?: string } = {}) {
  const data = useRootLoaderData()
  if (!data?.accounts) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Account[], Account[]>(async () => accountFindMany(db, { walletId }), [], data.accounts)
}
