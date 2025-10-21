import { LucidePieChart, LucideSettings } from 'lucide-react'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'

import type { CoreLayoutLink } from './ui/core-layout.js'

import { loaderPortfolio } from './data-access/loader-portfolio.js'
import { CoreLayout } from './ui/core-layout.js'

const DevRoutes = lazy(() => import('../dev/dev-routes.js'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: CoreLayoutLink[] = [
  { icon: LucidePieChart, label: 'Portfolio', to: '/portfolio' },
  { icon: LucideSettings, label: 'Settings', to: '/settings' },
]

const router = createHashRouter([
  {
    children: [
      { element: <Navigate replace to="/portfolio" />, index: true },
      {
        element: <PortfolioRoutes />,
        id: 'portfolio',
        loader: loaderPortfolio,
        path: 'portfolio/*',
      },
      { element: <DevRoutes />, path: 'dev/*' },
      { element: <SettingsRoutes />, path: 'settings/*' },
    ],
    element: <CoreLayout links={links} />,
  },
])

export function CoreRoutes() {
  return <RouterProvider router={router} />
}
