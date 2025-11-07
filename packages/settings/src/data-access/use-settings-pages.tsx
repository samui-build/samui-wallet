import { LucideNetwork, LucideSettings, LucideWallet2 } from 'lucide-react'

import type { SettingsPage } from './settings-page.ts'

export function useSettingsPages(): SettingsPage[] {
  return [
    {
      description: 'General settings for the wallet',
      icon: LucideSettings,
      id: 'general',
      name: 'General',
    },
    {
      description: 'Manage accounts and wallets',
      icon: LucideWallet2,
      id: 'accounts',
      name: 'Accounts',
    },
    {
      description: 'Manage networks and endpoints',
      icon: LucideNetwork,
      id: 'networks',
      name: 'Networks',
    },
  ]
}
