import { LucideNetwork, LucideSettings, LucideWallet2 } from 'lucide-react'

import type { SettingsPage } from './settings-page.ts'

export function useSettingsPages(): SettingsPage[] {
  return [
    {
      description: 'General settings for the app',
      icon: LucideSettings,
      id: 'general',
      name: 'General',
    },
    {
      description: 'Manage networks and endpoints',
      icon: LucideNetwork,
      id: 'networks',
      name: 'Networks',
    },
    {
      description: 'Manage wallets and accounts',
      icon: LucideWallet2,
      id: 'wallets',
      name: 'Wallets',
    },
  ]
}
