import { Navigate, useRoutes } from 'react-router'
import { DevFeatureDb } from './dev-feature-db.js'
import { DevLayout } from './ui/dev-layout.js'
import { DevFeatureOverview } from './dev-feature-overview.js'
import { DbBrowserProvider } from './data-access/db-browser-provider.js'
import { db } from '@workspace/db/db'

const links = [
  { label: 'Overview', to: '/dev/overview' },
  { label: 'DB', to: '/dev/db' },
]

export default function DevRoutes() {
  return useRoutes([
    {
      element: <DevLayout links={links} />,
      children: [
        { index: true, element: <Navigate replace to="overview" /> },
        { path: 'overview', element: <DevFeatureOverview /> },
        {
          path: 'db',
          element: (
            <DbBrowserProvider db={db}>
              <DevFeatureDb />
            </DbBrowserProvider>
          ),
        },
      ],
    },
  ])
}
