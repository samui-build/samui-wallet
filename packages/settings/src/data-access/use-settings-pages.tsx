import type { SettingsPage } from './settings-page.ts'

export function useSettingsPages(): SettingsPage[] {
  return [
    {
      description: 'General settings for the app',
      icon: 'settings',
      id: 'general',
      name: 'General',
    },
    {
      description: 'Manage networks and endpoints',
      icon: 'network',
      id: 'networks',
      name: 'Networks',
    },
    {
      description: 'Manage wallets and accounts',
      icon: 'wallet',
      id: 'wallets',
      name: 'Wallets',
    },
  ]
}
