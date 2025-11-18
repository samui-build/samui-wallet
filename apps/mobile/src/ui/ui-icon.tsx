import { cn } from '@workspace/ui/lib/utils'
import type { ColorValue } from 'react-native'
import { withUniwind } from 'uniwind'
import { getIcon, type UiIconName } from './ui-icon-map.tsx'

export function UiIcon({
  className = 'h-6 w-6',
  color,
  icon,
}: {
  className?: string
  color?: ColorValue
  icon: UiIconName
}) {
  const Icon = withUniwind(getIcon(icon))
  // @ts-expect-error TODO: Properly type this "Types of property color are incompatible."
  return <Icon className={cn('text-foreground', className)} color={color} />
}
