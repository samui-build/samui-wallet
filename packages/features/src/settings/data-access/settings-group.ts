import * as react from 'react'
import { ForwardRefExoticComponent } from 'react'
import { LucideProps } from 'lucide-react'
import { SettingsItem } from './settings-item.js'

export type SettingsIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

export interface SettingsGroup {
  icon: SettingsIcon
  id: string
  items: SettingsItem[]
  name: string
}
