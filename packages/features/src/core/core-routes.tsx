import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router'

import { CoreLayout } from './ui/core-layout.js'

const DevRoutes = lazy(() => import('../dev/dev-routes.js'))
const OnboardingRoutes = lazy(() => import('../onboarding/onboarding-routes.js'))
const PortfolioRoutes = lazy(() => import('../portfolio/portfolio-routes.js'))
const SettingsRoutes = lazy(() => import('../settings/settings-routes.js'))

const links = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Dev', to: '/dev' },
  { label: 'Onboarding', to: '/onboarding' },
  { label: 'Settings', to: '/settings' },
]

export function CoreRoutes() {
  return useRoutes([
    {
      children: [
        { element: <Navigate replace to="/portfolio" />, index: true },
        { element: <PortfolioRoutes />, path: 'portfolio/*' },
        { element: <DevRoutes />, path: 'dev/*' },
        { element: <OnboardingRoutes />, path: 'onboarding/*' },
        { element: <SettingsRoutes />, path: 'settings/*' },
      ],
      element: <CoreLayout links={links} />,
    },
  ])
}
