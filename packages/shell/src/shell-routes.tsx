import { optionsSetting } from '@workspace/db-react/options-setting'
import { queryClient } from '@workspace/db-react/query-client'
import { UiErrorBoundary } from '@workspace/ui/components/ui-error-boundary'
import { UiLoaderFull } from '@workspace/ui/components/ui-loader-full'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, type RouteObject, RouterProvider } from 'react-router'
import { rootRouteLoader } from './data-access/root-route-loader.tsx'
import type { ShellFeatureProps } from './shell-feature.tsx'
import { ShellUiLayout } from './ui/shell-ui-layout.tsx'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const ExplorerRoutes = lazy(() => import('@workspace/explorer/explorer-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const ToolsRoutes = lazy(() => import('@workspace/tools/tools-routes'))
const SettingsFeatureReset = lazy(() => import('@workspace/settings/settings-feature-reset'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

function createRouter({ browser, context }: ShellFeatureProps) {
  return createHashRouter([
    {
      children: context === 'Onboarding' ? getOnboardingRoutes() : getAppRoutes({ browser, context }),
      errorElement: <UiErrorBoundary />,
      hydrateFallbackElement: <UiLoaderFull />,
      id: 'root',
      loader: rootRouteLoader(context),
      shouldRevalidate: () => {
        const state = queryClient.getQueryState(optionsSetting.getAll().queryKey)
        return !state || state.isInvalidated
      },
    },
  ])
}

function getAppRoutes({ browser, context }: ShellFeatureProps): RouteObject[] {
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
      element: <ShellUiLayout browser={browser} context={context} />,
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

export function ShellRoutes({ browser, context }: ShellFeatureProps) {
  return <RouterProvider router={createRouter({ browser, context })} />
}
