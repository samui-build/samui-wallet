import { useMemo } from 'react'
import { getInitials } from '../lib/get-initials.ts'
import { getColorByName, getInitialsColor, type UiColorName } from '../lib/get-initials-colors.ts'
import { cn } from '../lib/utils.ts'
import { Avatar, AvatarFallback, AvatarImage } from './avatar.tsx'
import { UiIcon } from './ui-icon.tsx'
import type { UiIconName } from './ui-icon-map.tsx'

export function UiAvatar({
  className,
  color,
  icon,
  label,
  src,
}: {
  className?: string
  color?: UiColorName | undefined
  icon?: UiIconName
  label: string
  src?: string
}) {
  const initials = useMemo(() => getInitials(label), [label])
  const { bg, text } = useMemo(() => (color ? getColorByName(color) : getInitialsColor(initials)), [color, initials])
  const content = icon ? <UiIcon className="size-4" icon={icon} /> : initials
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} /> : null}
      <AvatarFallback className={cn('text-xs md:text-sm', bg, text)}>{content}</AvatarFallback>
    </Avatar>
  )
}
