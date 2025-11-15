import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'
import { loaderPortfolio } from './data-access/loader-portfolio.tsx'
import type { ShellMode } from './shell-feature.tsx'
import type { ShellLayoutLink } from './ui/shell-ui-layout.tsx'
import { ShellUiLayout } from './ui/shell-ui-layout.tsx'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const ExplorerRoutes = lazy(() => import('@workspace/explorer/explorer-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const ToolsRoutes = lazy(() => import('@workspace/tools/tools-routes'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: ShellLayoutLink[] = [
  { icon: 'portfolio', label: 'Portfolio', to: '/portfolio' },
  { icon: 'explorer', label: 'Explorer', to: '/explorer' },
  { icon: 'tools', label: 'Tools', to: '/tools' },
  { icon: 'settings', label: 'Settings', to: '/settings' },
]

function createRouterDefault(mode: ShellMode) {
  return createHashRouter([
    {
      children: [
        { element: <Navigate replace to="/portfolio" />, index: true },
        { element: <DevRoutes />, path: 'dev/*' },
        { element: <ExplorerRoutes basePath="/explorer" />, path: 'explorer/*' },
        {
          element: <PortfolioRoutes />,
          id: 'portfolio',
          loader: loaderPortfolio(mode),
          path: 'portfolio/*',
        },
        { element: <SettingsRoutes />, path: 'settings/*' },
        { element: <ToolsRoutes />, path: 'tools/*' },
        { element: <UiNotFound />, path: '*' },
      ],
      element: <ShellUiLayout links={links} />,
    },
    { element: <OnboardingRoutes redirectTo="/portfolio" />, path: 'onboarding/*' },
  ])
}

function createRouterOnboarding() {
  return createHashRouter([
    { element: <Navigate replace to="/onboarding" />, index: true },
    { element: <OnboardingRoutes redirectTo="/onboarding/complete" />, path: 'onboarding/*' },
    { element: <UiNotFound />, path: '*' },
  ])
}

export function ShellRoutes({ mode }: { mode: ShellMode }) {
  const router = mode === 'Onboarding' ? createRouterOnboarding() : createRouterDefault(mode)

  return <RouterProvider router={router} />
}
