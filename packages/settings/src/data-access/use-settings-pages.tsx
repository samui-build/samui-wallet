import { useTranslation } from '@workspace/i18n'
import type { SettingsPage } from './settings-page.ts'

export function useSettingsPages(): SettingsPage[] {
  const { t } = useTranslation('settings')
  return [
    {
      description: t(($) => $.pageGeneralDescription),
      icon: 'settings',
      id: 'general',
      name: t(($) => $.pageGeneralName),
    },
    {
      description: t(($) => $.pageNetworkDescription),
      icon: 'network',
      id: 'networks',
      name: t(($) => $.pageNetworkName),
    },
    {
      description: t(($) => $.pageWalletDescription),
      icon: 'wallet',
      id: 'wallets',
      name: t(($) => $.pageWalletName),
    },
  ]
}
