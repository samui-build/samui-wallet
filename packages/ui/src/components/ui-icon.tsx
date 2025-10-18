import type { LucideProps } from 'lucide-react'
import type * as react from 'react'
import type { ForwardRefExoticComponent } from 'react'

export type UiIconLucide = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

export function UiIcon({ className = 'h-6 w-6', icon: Icon }: { className?: string; icon: UiIconLucide }) {
  return <Icon className={className} />
}
