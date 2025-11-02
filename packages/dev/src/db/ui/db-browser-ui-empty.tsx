import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@workspace/ui/components/empty'
import { LucideTable } from 'lucide-react'

export function DbBrowserUiEmpty() {
  return (
    <Empty className="border border-dashed gap-3">
      <EmptyMedia variant="icon">
        <LucideTable />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Select table</EmptyTitle>
        <EmptyDescription>Select a table to get started.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
