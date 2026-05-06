import { Button } from '@workspace/ui/components/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@workspace/ui/components/empty'
import { Link } from 'react-router'
import type { DevDbTableConfig } from '../data-access/dev-db-table-config.ts'

export function DevDbUiTableEmpty({ config }: { config: DevDbTableConfig }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No records</EmptyTitle>
        <EmptyDescription>{config.label}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="sm" variant="outline">
          <Link to="create">Create</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
