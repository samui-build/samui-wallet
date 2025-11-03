import { db } from '@workspace/db/db'
import { UiCard } from '@workspace/ui/components/ui-card'

export function DevFeatureDbTables() {
  const tables = db.tables.map((table) => table.name)

  return (
    <UiCard title="db tables">
      <pre>{JSON.stringify(tables, null, 2)}</pre>
    </UiCard>
  )
}
