import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent } from 'react'
import type * as react from 'react'

import type { SettingsItem } from './settings-item.js'

export interface SettingsGroup {
  description: string
  icon: SettingsIcon
  id: string
  items: SettingsItem[]
  name: string
}

export type SettingsIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>
