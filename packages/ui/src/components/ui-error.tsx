import { useTranslation } from '@workspace/i18n'
import type { ReactNode } from 'react'
import { UiEmpty } from './ui-empty.tsx'
import type { UiIconName } from './ui-icon-map.tsx'

export function UiError({
  icon,
  message,
  title,
}: {
  icon?: UiIconName | undefined
  message?: Error
  title?: ReactNode
}) {
  const { t } = useTranslation('ui')
  return (
    <UiEmpty description={message ? message?.message : undefined} icon={icon} title={title ?? t(($) => $.errorTitle)} />
  )
}
