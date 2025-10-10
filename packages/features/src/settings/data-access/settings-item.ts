import type { SettingsType } from './settings-type.js'

export interface SettingsItem {
  description: string
  id: string
  name: string
  type: SettingsType
}
