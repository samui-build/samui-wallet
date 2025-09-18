import { createContext, ReactNode, useContext } from 'react'
import { LucideLock, LucidePaintBucket, LucideSettings } from 'lucide-react'
import { SettingsGroup } from './settings-group.js'
import { SettingsType } from './settings-type.js'

export const defaultItems: SettingsGroup[] = [
  {
    description: 'Managed general settings like language and currency',
    icon: LucideSettings,
    id: 'general',
    items: [
      {
        description: 'Select the language',
        id: 'language',
        name: 'Language',
        type: SettingsType.String,
      },
      {
        description: 'Select the currency',
        id: 'currency',
        name: 'Currency',
        type: SettingsType.String,
      },
    ],
    name: 'General',
  },
  {
    description: 'Manages security settings like auto-lock',
    icon: LucideLock,
    id: 'security',
    items: [
      {
        description: 'Enable auto lock',
        id: 'auto-lock-enabled',
        name: 'Auto lock enabled',
        type: SettingsType.Boolean,
      },
      {
        description: 'Configure auto lock timeout',
        id: 'auto-lock-seconds',
        name: 'Auto lock seconds',
        type: SettingsType.Number,
      },
    ],
    name: 'Security',
  },
  {
    description: 'Manage the appearance of the app',
    icon: LucidePaintBucket,
    id: 'appearance',
    items: [
      {
        description: 'Select the theme',
        id: 'theme',
        name: 'Theme',
        type: SettingsType.String,
      },
    ],
    name: 'Appearance',
  },
]

export interface SettingsProviderContext {
  basePath: string
  groups: SettingsGroup[]
}

const Context = createContext<SettingsProviderContext>({} as SettingsProviderContext)

export function SettingsProvider({ basePath, children }: { basePath: string; children: ReactNode }) {
  const value: SettingsProviderContext = {
    basePath,
    groups: defaultItems,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useSettings() {
  return useContext(Context)
}
