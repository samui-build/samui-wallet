import type { QueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'
import type { Setting } from '@workspace/db/entity/setting'
import type { LoaderFunctionArgs } from 'react-router'
import { redirect } from 'react-router'
import { dbAccountOptions } from './db-account-options.tsx'
import { dbGetOrFetchQuery } from './db-get-or-fetch.tsx'
import { dbNetworkOptions } from './db-network-options.tsx'
import { dbSettingOptions } from './db-setting-options.tsx'

export interface DbLoaderData {
  accounts: Account[]
  networks: Network[]
  settings: Setting[]
}

export function dbLoader(queryClient: QueryClient) {
  return async ({ request }: LoaderFunctionArgs): Promise<DbLoaderData | Response> => {
    const url = new URL(request.url)
    const pathname = url.pathname

    const [networks, settings] = await Promise.all([
      dbGetOrFetchQuery(queryClient, dbNetworkOptions.findMany({})),
      dbGetOrFetchQuery(queryClient, dbSettingOptions.getAll()),
    ])

    const activeWalletId = settings.find((s) => s.key === 'activeWalletId')?.value
    if (!activeWalletId && !pathname.startsWith('/onboarding')) {
      return redirect('/onboarding')
    }

    if (!networks.length) {
      return redirect('/settings/networks')
    }

    const accounts = activeWalletId
      ? await dbGetOrFetchQuery(queryClient, dbAccountOptions.findByWalletId(activeWalletId))
      : []

    return {
      accounts,
      networks,
      settings,
    }
  }
}
