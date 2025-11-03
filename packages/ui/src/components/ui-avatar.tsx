import { useMemo } from 'react'

import { getInitialsColor } from '../lib/get-initials-colors.ts'
import { getInitials } from '../lib/get-initials.ts'
import { Avatar, AvatarFallback, AvatarImage } from './avatar.tsx'

export function UiAvatar({ className, label, src }: { className?: string; label: string; src?: string }) {
  const initials = useMemo(() => getInitials(label), [label])
  const { bg, text } = useMemo(() => getInitialsColor(initials), [initials])
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} /> : null}
      <AvatarFallback className={`${bg} ${text}`}>{initials}</AvatarFallback>
    </Avatar>
  )
}
