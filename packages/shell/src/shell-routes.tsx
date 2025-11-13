import { dbLoader } from '@workspace/db-react/db-loader'
import { queryClient } from '@workspace/db-react/db-query-client'
import { dbSettingOptions } from '@workspace/db-react/db-setting-options'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'
import type { ShellLayoutLink } from './ui/shell-ui-layout.tsx'
import { ShellUiLayout } from './ui/shell-ui-layout.tsx'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const ExplorerRoutes = lazy(() => import('@workspace/explorer/explorer-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const ToolsRoutes = lazy(() => import('@workspace/tools/tools-routes'))
const SettingsFeatureReset = lazy(() => import('@workspace/settings/settings-feature-reset'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: ShellLayoutLink[] = [
  { icon: 'portfolio', label: 'Portfolio', to: '/portfolio' },
  { icon: 'explorer', label: 'Explorer', to: '/explorer' },
  { icon: 'tools', label: 'Tools', to: '/tools' },
  { icon: 'settings', label: 'Settings', to: '/settings' },
]

const router = createHashRouter([
  {
    children: [
      {
        children: [
          { element: <Navigate replace to="/portfolio" />, index: true },
          { element: <DevRoutes />, path: 'dev/*' },
          { element: <ExplorerRoutes basePath="/explorer" />, path: 'explorer/*' },
          {
            element: <PortfolioRoutes />,
            path: 'portfolio/*',
          },
          { element: <SettingsRoutes />, path: 'settings/*' },
          { element: <ToolsRoutes />, path: 'tools/*' },
          { element: <UiNotFound />, path: '*' },
        ],
        element: <ShellUiLayout links={links} />,
      },
      { element: <OnboardingRoutes />, path: 'onboarding/*' },
      { element: <SettingsFeatureReset />, path: 'reset' },
    ],
    id: 'root',
    loader: dbLoader(queryClient),
    shouldRevalidate: () => {
      const state = queryClient.getQueryState(dbSettingOptions.getAll().queryKey)
      return !state || state.isInvalidated
    },
  },
])

export function ShellRoutes() {
  return <RouterProvider router={router} />
}
