import type { Preference } from '@workspace/db/entity/preference'
import type { PreferenceKey } from '@workspace/db/entity/preference-key'

import { type QueryClient, queryOptions, useMutation } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useLiveQuery } from 'dexie-react-hooks'
import { LucidePieChart, LucideSettings } from 'lucide-react'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider, useRouteLoaderData } from 'react-router'

import type { ShellLayoutLink } from './ui/shell-ui-layout.js'

import { loaderPortfolio } from './data-access/loader-portfolio.js'
import { queryClient } from './data-access/shell-providers.js'
import { ShellUiLayout } from './ui/shell-ui-layout.js'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: ShellLayoutLink[] = [
  { icon: LucidePieChart, label: 'Portfolio', to: '/portfolio' },
  { icon: LucideSettings, label: 'Settings', to: '/settings' },
]

const settingsQuery = queryOptions({
  queryFn: async () => db.preferences.toArray(),
  queryKey: ['settings'],
})

export const loader = (queryClient: QueryClient) => async (): Promise<Preference[]> => {
  return queryClient.getQueryData(settingsQuery.queryKey) ?? (await queryClient.fetchQuery(settingsQuery))
}

const useSetting = <K extends PreferenceKey>(key: K) => {
  const initialData = useRouteLoaderData('root') as Awaited<Promise<Preference[]>>
  const setting = useLiveQuery(
    () => db.preferences.get({ key }),
    [key],
    initialData.find((p) => p.key === key),
  )
  const value = setting?.value
  const { mutate: setValue } = useMutation({
    mutationFn: async (newValue: string) => await db.preferences.where('key').equals(key).modify({ value: newValue }),
  })

  return [value, setValue] as const
}

const router = createHashRouter([
  {
    children: [
      { element: <Test />, id: 'test', path: 'test' },
      { element: <Navigate replace to="/portfolio" />, index: true },
      {
        element: <PortfolioRoutes />,
        id: 'portfolio',
        loader: loaderPortfolio,
        path: 'portfolio/*',
      },
      { element: <DevRoutes />, path: 'dev/*' },
      { element: <SettingsRoutes />, path: 'settings/*' },
      { element: <UiNotFound />, path: '*' },
    ],
    element: <ShellUiLayout links={links} />,
    id: 'root',
    loader: loader(queryClient),
  },
])

export function ShellRoutes() {
  return <RouterProvider router={router} />
}

function ActiveCluster() {
  const [value, setValue] = useSetting('activeClusterId')

  return (
    <div>
      <div>{value}</div>
      <button onClick={() => setValue('new-value-' + Date.now())}>Set Value</button>
    </div>
  )
}

function ActiveWalletId() {
  const [value, setValue] = useSetting('activeWalletId')

  return (
    <div>
      <div>{value}</div>
      <button onClick={() => setValue('new-value-' + Date.now())}>Set Value</button>
    </div>
  )
}

function Test() {
  return (
    <>
      <ActiveCluster />
      <ActiveWalletId />
    </>
  )
}
