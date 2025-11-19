import type { Account } from '@workspace/db/account/account'
import { accountFindByWalletId } from '@workspace/db/account/account-find-by-wallet-id'
import { db } from '@workspace/db/db'
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

  return useLiveQuery<Account[], Account[]>(() => accountFindByWalletId(db, walletId), [walletId], data.accounts)
}
