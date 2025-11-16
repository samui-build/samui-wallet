import { db } from '@workspace/db/db'
import { dbAccountFindByWalletId } from '@workspace/db/db-account-find-by-wallet-id'
import type { Account } from '@workspace/db/entity/account'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRouteLoaderData } from 'react-router'
import type { DbLoaderData } from './db-loader.tsx'
import { useDbSetting } from './use-db-setting.tsx'

export function useDbAccountLive({ walletId }: { walletId?: null | string } = {}) {
  const [activeWalletId] = useDbSetting('activeWalletId')
  if (!activeWalletId) {
    throw new Error('No active wallet set.')
  }

  const data = useRouteLoaderData<DbLoaderData>('root')
  if (!data?.accounts) {
    throw new Error('Loader not called.')
  }

  return useLiveQuery<Account[], Account[]>(() => dbAccountFindByWalletId(db, walletId), [walletId], data.accounts)
}
