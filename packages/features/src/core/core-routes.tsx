import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router'
import { CoreLayout } from './ui/core-layout.js'

const DevRoutes = lazy(() => import('../dev/dev-routes.js'))
const PortfolioRoutes = lazy(() => import('../portfolio/portfolio-routes.js'))
const SettingsRoutes = lazy(() => import('../settings/settings-routes.js'))

const links = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Dev', to: '/dev' },
  { label: 'Settings', to: '/settings' },
]

export function CoreRoutes() {
  return useRoutes([
    {
      element: <CoreLayout links={links} />,
      children: [
        { index: true, element: <Navigate replace to="/portfolio" /> },
        { path: 'portfolio/*', element: <PortfolioRoutes /> },
        { path: 'dev/*', element: <DevRoutes /> },
        { path: 'settings/*', element: <SettingsRoutes /> },
      ],
    },
  ])
}
