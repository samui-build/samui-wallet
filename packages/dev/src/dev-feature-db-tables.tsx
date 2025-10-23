import { db } from '@workspace/db/db'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useMemo } from 'react'

export function DevFeatureDbTables() {
  const tables = useMemo(() => db.tables.map((table) => table.name), [db])

  return (
    <UiCard title="db tables">
      <pre>{JSON.stringify(tables, null, 2)}</pre>
    </UiCard>
  )
}
