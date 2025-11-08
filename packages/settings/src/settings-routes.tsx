import { Navigate, useRoutes } from 'react-router'
import { SettingsFeatureGeneral } from './settings-feature-general.tsx'
import { SettingsFeatureNetworkCreate } from './settings-feature-network-create.tsx'
import { SettingsFeatureNetworkList } from './settings-feature-network-list.tsx'
import { SettingsFeatureNetworkUpdate } from './settings-feature-network-update.tsx'
import { SettingsFeatureWalletAddAccount } from './settings-feature-wallet-add-account.tsx'
import { SettingsFeatureWalletCreate } from './settings-feature-wallet-create.tsx'
import { SettingsFeatureWalletDetails } from './settings-feature-wallet-details.tsx'
import { SettingsFeatureWalletGenerate } from './settings-feature-wallet-generate.tsx'
import { SettingsFeatureWalletImport } from './settings-feature-wallet-import.tsx'
import { SettingsFeatureWalletList } from './settings-feature-wallet-list.tsx'
import { SettingsFeatureWalletUpdate } from './settings-feature-wallet-update.tsx'
import { SettingsUiLayout } from './ui/settings-ui-layout.tsx'

export default function SettingsRoutes() {
  return useRoutes([
    {
      children: [
        { element: <Navigate replace to="general" />, index: true },
        {
          children: [
            { element: <SettingsFeatureWalletList />, index: true },
            { element: <SettingsFeatureWalletCreate />, path: 'create' },
            { element: <SettingsFeatureWalletGenerate />, path: 'generate' },
            { element: <SettingsFeatureWalletImport />, path: 'import' },
            { element: <SettingsFeatureWalletDetails />, path: ':walletId' },
            { element: <SettingsFeatureWalletAddAccount />, path: ':walletId/add' },
            { element: <SettingsFeatureWalletUpdate />, path: ':walletId/edit' },
          ],
          path: 'wallets',
        },
        {
          children: [
            { element: <SettingsFeatureNetworkList />, index: true },
            { element: <SettingsFeatureNetworkCreate />, path: 'create' },
            { element: <SettingsFeatureNetworkUpdate />, path: ':networkId' },
          ],
          path: 'networks',
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
