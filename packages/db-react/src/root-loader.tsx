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
}

export async function rootLoader() {
  const [accounts, networks, settings, wallets] = await Promise.all([
    getOrFetchQuery(queryClient, optionsAccount.findMany({})),
    getOrFetchQuery(queryClient, optionsNetwork.findMany({})),
    getOrFetchQuery(queryClient, optionsSetting.findMany({})),
    getOrFetchQuery(queryClient, optionsWallet.findMany({})),
  ])

  return {
    accounts,
    networks,
    settings,
    wallets,
  }
}
