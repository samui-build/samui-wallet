import type { ReactNode } from 'react'
import { UiEmpty } from './ui-empty.tsx'
import type { UiIconName } from './ui-icon-map.tsx'

export function UiError({
  icon,
  message,
  title = 'Oops, an error occurred',
}: {
  icon?: UiIconName | undefined
  message?: Error
  title?: ReactNode
}) {
  return <UiEmpty description={message ? message?.message : undefined} icon={icon} title={title} />
}
