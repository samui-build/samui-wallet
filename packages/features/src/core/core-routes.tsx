import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router'

import { CoreLayout } from './ui/core-layout.js'

const DevRoutes = lazy(() => import('../dev/dev-routes.js'))
const PortfolioRoutes = lazy(() => import('../portfolio/portfolio-routes.js'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Dev', to: '/dev' },
  { label: 'Settings', to: '/settings' },
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
