import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@workspace/ui/components/empty'

export function DevDbUiTableNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Table not found</EmptyTitle>
        <EmptyDescription>Database</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
