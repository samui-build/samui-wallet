import type { Account } from '@workspace/db/account/account'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRootLoaderData } from './use-root-loader-data.tsx'

export function useAccountsForWalletLive({ walletId }: { walletId: string }) {
  const data = useRootLoaderData()
  if (!data?.accounts) {
    throw new Error('Root loader not called.')
  }

  const accounts = useLiveQuery<Account[], Account[]>(() => accountFindMany(db), [], data.accounts)
  return accounts.filter((account) => account.walletId === walletId)
}
