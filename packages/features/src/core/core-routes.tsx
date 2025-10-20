import { LucidePieChart, LucideSettings } from 'lucide-react'
import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router'

import type { CoreLayoutLink } from './ui/core-layout.js'

import { CoreLayout } from './ui/core-layout.js'

const DevRoutes = lazy(() => import('../dev/dev-routes.js'))
const PortfolioRoutes = lazy(() => import('../portfolio/portfolio-routes.js'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: CoreLayoutLink[] = [
  { icon: LucidePieChart, label: 'Portfolio', to: '/portfolio' },
  { icon: LucideSettings, label: 'Settings', to: '/settings' },
]

export function CoreRoutes() {
  return useRoutes([
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
}
