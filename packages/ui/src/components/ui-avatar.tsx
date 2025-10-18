import { useMemo } from 'react'

import { getInitialsColor } from '../lib/get-initials-colors.js'
import { getInitials } from '../lib/get-initials.js'
import { Avatar, AvatarFallback, AvatarImage } from './avatar.js'

export function UiAvatar({ className, label, src }: { className?: string; label: string; src?: string }) {
  const initials = useMemo(() => getInitials(label), [label])
  const { bg, text } = useMemo(() => getInitialsColor(initials), [initials])
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} /> : null}
      <AvatarFallback className={`${bg} ${text}`} delayMs={src ? 600 : undefined}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
