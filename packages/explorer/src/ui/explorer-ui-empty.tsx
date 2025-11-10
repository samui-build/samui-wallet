import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { LucideGlobe } from 'lucide-react'
import type { ReactNode } from 'react'

export function ExplorerUiEmpty({
  children,
  description,
  title,
}: {
  children?: ReactNode
  description: ReactNode
  title: ReactNode
}) {
  return (
    <Empty className="border border-dashed gap-3">
      <EmptyMedia variant="icon">
        <LucideGlobe />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
