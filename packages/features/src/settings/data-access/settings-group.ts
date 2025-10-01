import type { ForwardRefExoticComponent } from 'react'
import * as react from 'react'
import type { LucideProps } from 'lucide-react'
import type { SettingsItem } from './settings-item.js'

export type SettingsIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

export interface SettingsGroup {
  description: string
  icon: SettingsIcon
  id: string
  items: SettingsItem[]
  name: string
}
