import { dbLoader } from '@workspace/db-react/db-loader'
import { queryClient } from '@workspace/db-react/db-query-client'
import { dbSettingOptions } from '@workspace/db-react/db-setting-options'
import { i18n } from '@workspace/i18n'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider, redirect } from 'react-router'
import { ShellUiLayout } from './ui/shell-ui-layout.tsx'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const ExplorerRoutes = lazy(() => import('@workspace/explorer/explorer-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const ToolsRoutes = lazy(() => import('@workspace/tools/tools-routes'))
const SettingsFeatureReset = lazy(() => import('@workspace/settings/settings-feature-reset'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

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
        element: <ShellUiLayout />,
      },
      { element: <OnboardingRoutes />, path: 'onboarding/*' },
      { element: <SettingsFeatureReset />, path: 'reset' },
    ],
    id: 'root',
    loader: async (args) => {
      const url = new URL(args.request.url)
      const pathname = url.pathname

      const result = await dbLoader()
      const { settings, networks } = result

      const activeWalletId = settings.find((s) => s.key === 'activeWalletId')?.value
      if (!activeWalletId && !pathname.startsWith('/onboarding')) {
        return redirect('/onboarding')
      }

      if (!networks.length) {
        return redirect('/settings/networks')
      }

      const language = settings.find((s) => s.key === 'language')?.value ?? 'en'
      i18n.changeLanguage(language)

      return result
    },
    shouldRevalidate: () => {
      const state = queryClient.getQueryState(dbSettingOptions.getAll().queryKey)
      return !state || state.isInvalidated
    },
  },
])

export function ShellRoutes() {
  return <RouterProvider router={router} />
}
