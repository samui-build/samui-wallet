import type { LucideProps } from 'lucide-react'
import type * as react from 'react'
import type { ForwardRefExoticComponent } from 'react'

export type SettingsIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

export interface SettingsPage {
  description: string
  icon: SettingsIcon
  id: string
  name: string
}
