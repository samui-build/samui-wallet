import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty.js'
import { LucideDatabase } from 'lucide-react'

export function DbBrowserEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LucideDatabase />
        </EmptyMedia>
        <EmptyTitle>No table selected</EmptyTitle>
        <EmptyDescription>Select a table to continue</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
