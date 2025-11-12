import { getIcon, type UiIconName } from './ui-icon-map.tsx'

export function UiIcon({ className = 'h-6 w-6', icon }: { className?: string; icon: UiIconName }) {
  const Icon = getIcon(icon)

  return <Icon className={className} />
}
