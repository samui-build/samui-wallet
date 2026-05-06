import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@workspace/ui/components/empty'
import type { DevDbTableConfig } from '../data-access/dev-db-table-config.ts'

export function DevDbUiRecordNotFound({ config }: { config: DevDbTableConfig }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Record not found</EmptyTitle>
        <EmptyDescription>{config.label}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
