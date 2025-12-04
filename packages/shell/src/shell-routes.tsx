import { optionsAccount } from '@workspace/db-react/options-account'
import { optionsNetwork } from '@workspace/db-react/options-network'
import { optionsSetting } from '@workspace/db-react/options-setting'
import { optionsWallet } from '@workspace/db-react/options-wallet'
import { queryClient } from '@workspace/db-react/query-client'
import { getEntrypoint } from '@workspace/env/get-entrypoint'
import { UiErrorBoundary } from '@workspace/ui/components/ui-error-boundary'
import { UiLoaderFull } from '@workspace/ui/components/ui-loader-full'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, type RouteObject, RouterProvider } from 'react-router'
import { rootRouteLoader } from './data-access/root-route-loader.tsx'
import { ShellUiLayout } from './ui/shell-ui-layout.tsx'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const ExplorerRoutes = lazy(() => import('@workspace/explorer/explorer-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const PortfolioModals = lazy(() => import('@workspace/portfolio/portfolio-modals'))
const ToolsRoutes = lazy(() => import('@workspace/tools/tools-routes'))
const SettingsFeatureReset = lazy(() => import('@workspace/settings/settings-feature-reset'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))
const RequestRoutes = lazy(() => import('@workspace/request/request-routes'))

function getRoutes() {
  switch (getEntrypoint()) {
    case 'onboarding':
      return getOnboardingRoutes()
    case 'request':
      return getRequestRoutes()
    default:
      return getAppRoutes()
  }
}

function createRouter() {
  return createHashRouter([
    {
      children: getRoutes(),
      errorElement: <UiErrorBoundary />,
      hydrateFallbackElement: <UiLoaderFull />,
      id: 'root',
      loader: rootRouteLoader(),
      shouldRevalidate: () =>
        [
          queryClient.getQueryState(optionsAccount.findMany({}).queryKey)?.isInvalidated,
          queryClient.getQueryState(optionsNetwork.findMany({}).queryKey)?.isInvalidated,
          queryClient.getQueryState(optionsSetting.getAll().queryKey)?.isInvalidated,
          queryClient.getQueryState(optionsWallet.findMany({}).queryKey)?.isInvalidated,
        ].some((isInvalidated) => isInvalidated || false),
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
    { element: <PortfolioModals />, path: 'modals/*' },
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

function getRequestRoutes(): RouteObject[] {
  return [
    { element: <Navigate replace to="/request" />, index: true },
    {
      element: <RequestRoutes />,
      id: 'request',
      loader: async () => {
        const { requestRouteLoader } = await import('@workspace/request/data-access/request-route-loader')
        return await requestRouteLoader()
      },
      path: 'request/*',
    },
    { element: <UiNotFound />, path: '*' },
  ]
}

export function ShellRoutes() {
  return <RouterProvider router={createRouter()} />
}
