import { queryClient } from '@workspace/db-react/db-query-client'
import { dbSettingOptions } from '@workspace/db-react/db-setting-options'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, type RouteObject, RouterProvider } from 'react-router'
import { rootLoader } from './data-access/root-loader.tsx'
import type { ShellContext } from './shell-feature.tsx'
import { ShellUiLayout } from './ui/shell-ui-layout.tsx'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const ExplorerRoutes = lazy(() => import('@workspace/explorer/explorer-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const ToolsRoutes = lazy(() => import('@workspace/tools/tools-routes'))
const SettingsFeatureReset = lazy(() => import('@workspace/settings/settings-feature-reset'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

function createRouter(context: ShellContext) {
  return createHashRouter([
    {
      children: context === 'Onboarding' ? getOnboardingRoutes() : getAppRoutes(),
      id: 'root',
      loader: rootLoader(context),
      shouldRevalidate: () => {
        const state = queryClient.getQueryState(dbSettingOptions.getAll().queryKey)
        return !state || state.isInvalidated
      },
    },
  ])
}

function getAppRoutes(): RouteObject[] {
  return [
    { element: <Navigate replace to="/portfolio" />, index: true },
    {
      children: [
        { element: <DevRoutes />, path: 'dev/*' },
        { element: <ExplorerRoutes basePath="/explorer" />, path: 'explorer/*' },
        { element: <PortfolioRoutes />, path: 'portfolio/*' },
        { element: <SettingsRoutes />, path: 'settings/*' },
        { element: <ToolsRoutes />, path: 'tools/*' },
        { element: <UiNotFound />, path: '*' },
      ],
      element: <ShellUiLayout />,
    },
    { element: <OnboardingRoutes redirectTo="/portfolio" />, path: 'onboarding/*' },
    { element: <SettingsFeatureReset />, path: 'reset' },
  ]
}

function getOnboardingRoutes(): RouteObject[] {
  return [
    { element: <Navigate replace to="/onboarding" />, index: true },
    { element: <OnboardingRoutes redirectTo="/onboarding/complete" />, path: 'onboarding/*' },
    { element: <UiNotFound />, path: '*' },
  ]
}

export function ShellRoutes({ context }: { context: ShellContext }) {
  return <RouterProvider router={createRouter(context)} />
}
