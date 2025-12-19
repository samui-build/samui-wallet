import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { LucideWallet2 } from 'lucide-react'
import type { ReactNode } from 'react'

export function PlaygroundUiEmpty({
  children,
  description,
  title,
}: {
  children?: ReactNode
  description: ReactNode
  title: ReactNode
}) {
  return (
    <Empty className="gap-3 border border-dashed">
      <EmptyMedia variant="icon">
        <LucideWallet2 />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}
