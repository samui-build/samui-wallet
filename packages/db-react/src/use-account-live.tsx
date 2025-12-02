import type { Account } from '@workspace/db/account/account'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountLive() {
  const [walletId] = useSetting('activeWalletId')
  if (!walletId) {
    throw new Error('No active wallet set.')
  }

  const data = useRootLoaderData()
  if (!data?.accounts) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Account[], Account[]>(() => accountFindMany(db, { walletId }), [walletId], data.accounts)
}
