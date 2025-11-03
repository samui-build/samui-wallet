import { Navigate, useRoutes } from 'react-router'

import { SettingsFeatureAccountAddWallet } from './settings-feature-account-add-wallet.tsx'
import { SettingsFeatureAccountCreate } from './settings-feature-account-create.tsx'
import { SettingsFeatureAccountDetails } from './settings-feature-account-details.tsx'
import { SettingsFeatureAccountGenerate } from './settings-feature-account-generate.tsx'
import { SettingsFeatureAccountImport } from './settings-feature-account-import.tsx'
import { SettingsFeatureAccountList } from './settings-feature-account-list.tsx'
import { SettingsFeatureAccountUpdate } from './settings-feature-account-update.tsx'
import { SettingsFeatureClusterCreate } from './settings-feature-cluster-create.tsx'
import { SettingsFeatureClusterList } from './settings-feature-cluster-list.tsx'
import { SettingsFeatureClusterUpdate } from './settings-feature-cluster-update.tsx'
import { SettingsFeatureGeneral } from './settings-feature-general.tsx'
import { SettingsUiLayout } from './ui/settings-ui-layout.tsx'

export default function SettingsRoutes() {
  return useRoutes([
    {
      children: [
        { element: <Navigate replace to="general" />, index: true },
        {
          children: [
            { element: <SettingsFeatureAccountList />, index: true },
            { element: <SettingsFeatureAccountCreate />, path: 'create' },
            { element: <SettingsFeatureAccountGenerate />, path: 'generate' },
            { element: <SettingsFeatureAccountImport />, path: 'import' },
            { element: <SettingsFeatureAccountDetails />, path: ':accountId' },
            { element: <SettingsFeatureAccountAddWallet />, path: ':accountId/add' },
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
        {
          children: [{ element: <SettingsFeatureGeneral />, index: true }],
          path: 'general',
        },
      ],
      element: <SettingsUiLayout />,
    },
  ])
}
