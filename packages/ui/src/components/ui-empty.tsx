import { cn } from '@workspace/ui/lib/utils'
import type { ReactNode } from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty.tsx'
import { UiIcon } from './ui-icon.tsx'
import type { UiIconName } from './ui-icon-map.tsx'

export function UiEmpty({
  children,
  className,
  description,
  icon,
  title,
}: {
  children?: ReactNode
  className?: string
  description: ReactNode
  icon?: UiIconName | undefined
  title: ReactNode
}) {
  return (
    <Empty className={cn('gap-3 border border-dashed', className)}>
      {icon ? (
        <EmptyMedia variant="icon">
          <UiIcon icon={icon} />
        </EmptyMedia>
      ) : null}
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
