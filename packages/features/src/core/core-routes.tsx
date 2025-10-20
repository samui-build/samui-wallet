import { LucidePieChart, LucideSettings } from 'lucide-react'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'

import type { CoreLayoutLink } from './ui/core-layout.js'

import { CoreLayout } from './ui/core-layout.js'

const DevRoutes = lazy(() => import('../dev/dev-routes.js'))
const PortfolioRoutes = lazy(() => import('../portfolio/portfolio-routes.js'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: CoreLayoutLink[] = [
  { icon: LucidePieChart, label: 'Portfolio', to: '/portfolio' },
  { icon: LucideSettings, label: 'Settings', to: '/settings' },
]

const router = createHashRouter([
  {
    children: [
      { element: <Navigate replace to="/portfolio" />, index: true },
      { element: <PortfolioRoutes />, path: 'portfolio/*' },
      { element: <DevRoutes />, path: 'dev/*' },
      { element: <SettingsRoutes />, path: 'settings/*' },
    ],
    element: <CoreLayout links={links} />,
  },
])

export function CoreRoutes() {
  return <RouterProvider router={router} />
}
