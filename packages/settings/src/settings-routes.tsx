import { Navigate, useRoutes } from 'react-router'

import { SettingsFeatureAccountCreate } from './settings-feature-account-create.js'
import { SettingsFeatureAccountDetails } from './settings-feature-account-details.js'
import { SettingsFeatureAccountGenerate } from './settings-feature-account-generate.js'
import { SettingsFeatureAccountImport } from './settings-feature-account-import.js'
import { SettingsFeatureAccountList } from './settings-feature-account-list.js'
import { SettingsFeatureAccountUpdate } from './settings-feature-account-update.js'
import { SettingsFeatureClusterCreate } from './settings-feature-cluster-create.js'
import { SettingsFeatureClusterList } from './settings-feature-cluster-list.js'
import { SettingsFeatureClusterUpdate } from './settings-feature-cluster-update.js'
import { SettingsUiLayout } from './ui/settings-ui-layout.js'

export default function SettingsRoutes() {
  return useRoutes([
    {
      children: [
        { element: <Navigate replace to="accounts" />, index: true },
        {
          children: [
            { element: <SettingsFeatureAccountList />, index: true },
            { element: <SettingsFeatureAccountCreate />, path: 'create' },
            { element: <SettingsFeatureAccountGenerate />, path: 'generate' },
            { element: <SettingsFeatureAccountImport />, path: 'import' },
            { element: <SettingsFeatureAccountDetails />, path: ':accountId' },
            { element: <SettingsFeatureAccountUpdate />, path: ':accountId/edit' },
          ],
          path: 'accounts',
        },
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
