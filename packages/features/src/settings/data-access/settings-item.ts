import { SettingsType } from './settings-type.js'

export interface SettingsItem {
  id: string
  name: string
  description: string
  type: SettingsType
}
