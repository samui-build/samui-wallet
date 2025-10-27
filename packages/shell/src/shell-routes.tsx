import { usePreference, usePreferenceValue } from '@workspace/settings/data-access/settings-provider'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { LucidePieChart, LucideSettings } from 'lucide-react'
import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'

import type { ShellLayoutLink } from './ui/shell-ui-layout.js'

import { loaderPortfolio } from './data-access/loader-portfolio.js'
import { ShellUiLayout } from './ui/shell-ui-layout.js'

const DevRoutes = lazy(() => import('@workspace/dev/dev-routes'))
const OnboardingRoutes = lazy(() => import('@workspace/onboarding/onboarding-routes'))
const PortfolioRoutes = lazy(() => import('@workspace/portfolio/portfolio-routes'))
const SettingsRoutes = lazy(() => import('@workspace/settings/settings-routes'))

const links: ShellLayoutLink[] = [
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
      { element: <Demo />, path: 'demo/*' },
      { element: <UiNotFound />, path: '*' },
    ],
    element: <ShellUiLayout links={links} />,
  },
  { element: <OnboardingRoutes />, path: 'onboarding/*' },
])

export function ShellRoutes() {
  return <RouterProvider router={router} />
}

function Demo() {
  const apiEndpointPref = usePreference('apiEndpoint')
  const apiEndpoint = usePreferenceValue('apiEndpoint')

  return (
    <div>
      <pre>{JSON.stringify({ apiEndpoint, apiEndpointPref }, null, 2)}</pre>
    </div>
  )
}
