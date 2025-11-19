import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/entity/network'
import type { Setting } from '@workspace/db/entity/setting'
import { dbAccountOptions } from './db-account-options.tsx'
import { dbGetOrFetchQuery } from './db-get-or-fetch.tsx'
import { dbNetworkOptions } from './db-network-options.tsx'
import { queryClient } from './db-query-client.tsx'
import { dbSettingOptions } from './db-setting-options.tsx'

export interface DbLoaderData {
  accounts: Account[]
  networks: Network[]
  settings: Setting[]
}

export async function dbLoader() {
  const [networks, settings] = await Promise.all([
    dbGetOrFetchQuery(queryClient, dbNetworkOptions.findMany({})),
    dbGetOrFetchQuery(queryClient, dbSettingOptions.getAll()),
  ])

  const activeWalletId = settings.find((s) => s.key === 'activeWalletId')?.value
  const accounts = activeWalletId
    ? await dbGetOrFetchQuery(queryClient, dbAccountOptions.findByWalletId(activeWalletId))
    : []

  return {
    accounts,
    networks,
    settings,
  }
}
