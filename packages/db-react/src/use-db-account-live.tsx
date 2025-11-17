import { db } from '@workspace/db/db'
import { dbAccountFindByWalletId } from '@workspace/db/db-account-find-by-wallet-id'
import type { Account } from '@workspace/db/entity/account'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDbSetting } from './use-db-setting.tsx'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useDbAccountLive({ walletId }: { walletId?: null | string } = {}) {
  const [activeWalletId] = useDbSetting('activeWalletId')
  if (!activeWalletId) {
    throw new Error('No active wallet set.')
  }

  const data = useRootLoaderData()
  if (!data?.accounts) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Account[], Account[]>(() => dbAccountFindByWalletId(db, walletId), [walletId], data.accounts)
}
