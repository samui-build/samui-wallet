import type { ReactNode } from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty.tsx'
import { UiIcon, type UiIconLucide } from './ui-icon.tsx'

export function UiEmpty({
  children,
  description,
  icon,
  title,
}: {
  children?: ReactNode
  description: ReactNode
  icon?: UiIconLucide
  title: ReactNode
}) {
  return (
    <Empty className="border border-dashed gap-3">
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
