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
  iconClassName,
  title,
}: {
  children?: ReactNode
  className?: string
  description?: ReactNode
  icon?: UiIconName | undefined
  iconClassName?: string
  title?: ReactNode | undefined
}) {
  return (
    <Empty className={cn('gap-3 border border-dashed', className)}>
      {icon ? (
        <EmptyMedia variant="icon">
          <UiIcon className={iconClassName ?? ''} icon={icon} />
        </EmptyMedia>
      ) : null}
      <EmptyHeader>
        {title ? <EmptyTitle>{title}</EmptyTitle> : null}
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {children ? <EmptyContent className="md:max-w-2xl lg:max-w-3xl">{children}</EmptyContent> : null}
    </Empty>
  )
}
