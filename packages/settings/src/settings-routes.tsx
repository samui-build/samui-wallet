import { Navigate, useRoutes } from 'react-router'

import { SettingsFeatureClusterCreate } from './settings-feature-cluster-create.js'
import { SettingsFeatureClusterList } from './settings-feature-cluster-list.js'
import { SettingsFeatureClusterUpdate } from './settings-feature-cluster-update.js'
import { SettingsUiLayout } from './ui/settings-ui-layout.js'

export default function SettingsRoutes() {
  return useRoutes([
    {
      children: [
        { element: <Navigate replace to="clusters" />, index: true },
        {
          children: [
            { element: <SettingsFeatureClusterList />, index: true },
            { element: <SettingsFeatureClusterCreate />, path: 'create' },
            { element: <SettingsFeatureClusterUpdate />, path: ':clusterId' },
          ],
          path: 'clusters',
        },
      ],
      element: <SettingsUiLayout />,
    },
  ])
}
