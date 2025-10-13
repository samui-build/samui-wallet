import { LucideNetwork } from 'lucide-react'

import type { SettingsPage } from './settings-page.js'

export function useSettingsPages(): SettingsPage[] {
  return [
    {
      description: 'Manage clusters and endpoints',
      icon: LucideNetwork,
      id: 'clusters',
      name: 'Clusters',
    },
  ]
}
