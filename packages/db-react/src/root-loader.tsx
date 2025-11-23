import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import type { Setting } from '@workspace/db/setting/setting'
import { getOrFetchQuery } from './get-or-fetch.tsx'
import { optionsAccount } from './options-account.tsx'
import { optionsNetwork } from './options-network.tsx'
import { optionsSetting } from './options-setting.tsx'
import { queryClient } from './query-client.tsx'

export interface RootLoaderData {
  accounts: Account[]
  networks: Network[]
  settings: Setting[]
}

export async function rootLoader() {
  const [networks, settings] = await Promise.all([
    getOrFetchQuery(queryClient, optionsNetwork.findMany({})),
    getOrFetchQuery(queryClient, optionsSetting.getAll()),
  ])

  const activeWalletId = settings.find((s) => s.key === 'activeWalletId')?.value
  const accounts = activeWalletId
    ? await getOrFetchQuery(queryClient, optionsAccount.findByWalletId(activeWalletId))
    : []

  return {
    accounts,
    networks,
    settings,
  }
}
