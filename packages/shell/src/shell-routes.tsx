import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'
import { loaderPortfolio } from './data-access/loader-portfolio.tsx'
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

const router = createHashRouter([
  {
    children: [
      { element: <Navigate replace to="/portfolio" />, index: true },
      { element: <DevRoutes />, path: 'dev/*' },
      { element: <ExplorerRoutes basePath="/explorer" />, path: 'explorer/*' },
      {
        element: <PortfolioRoutes />,
        id: 'portfolio',
        loader: loaderPortfolio,
        path: 'portfolio/*',
      },
      { element: <SettingsRoutes />, path: 'settings/*' },
      { element: <ToolsRoutes />, path: 'tools/*' },
      { element: <UiNotFound />, path: '*' },
    ],
    element: <ShellUiLayout links={links} />,
  },
  { element: <OnboardingRoutes />, path: 'onboarding/*' },
])

export function ShellRoutes() {
  return <RouterProvider router={router} />
}
