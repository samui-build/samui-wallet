import { tryCatch } from '@workspace/core/try-catch'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import type { Setting } from '@workspace/db/setting/setting'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { getOrFetchQuery } from './get-or-fetch.tsx'
import { optionsAccount } from './options-account.tsx'
import { optionsNetwork } from './options-network.tsx'
import { optionsSetting } from './options-setting.tsx'
import { optionsWallet } from './options-wallet.tsx'
import { queryClient } from './query-client.tsx'

export interface RootLoaderData {
  accounts: Account[]
  networks: Network[]
  settings: Setting[]
  wallets: Wallet[]
  activeAccount: Account | null
}

export async function rootLoader() {
  const [networks, settings, wallets] = await Promise.all([
    getOrFetchQuery(queryClient, optionsNetwork.findMany()),
    getOrFetchQuery(queryClient, optionsSetting.getAll()),
    getOrFetchQuery(queryClient, optionsWallet.findMany()),
  ])

  const activeWalletId = settings.find((s) => s.key === 'activeWalletId')?.value
  const accounts = activeWalletId
    ? await getOrFetchQuery(queryClient, optionsAccount.findMany({ walletId: activeWalletId }))
    : []

  const { data: activeAccount } = await tryCatch(getOrFetchQuery(queryClient, optionsAccount.getActive()))

  return {
    accounts,
    activeAccount,
    networks,
    settings,
    wallets,
  }
}
