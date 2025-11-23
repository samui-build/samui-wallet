import type { Account } from '@workspace/db/account/account'
import { accountFindByWalletId } from '@workspace/db/account/account-find-by-wallet-id'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'
import { useSetting } from './use-setting.tsx'

export function useAccountLive({ walletId }: { walletId?: null | string } = {}) {
  const [activeWalletId] = useSetting('activeWalletId')
  if (!activeWalletId) {
    throw new Error('No active wallet set.')
  }

  const data = useRootLoaderData()
  if (!data?.accounts) {
    throw new Error('Root loader not called.')
  }

  return useLiveQuery<Account[], Account[]>(() => accountFindByWalletId(db, walletId), [walletId], data.accounts)
}
