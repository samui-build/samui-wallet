import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { Link, useParams } from 'react-router'
import { getDevDbTableConfig } from './data-access/dev-db-table-config.ts'
import { useDevDbRecordsQuery } from './data-access/use-dev-db-records-query.ts'
import { DevDbUiTableEmpty } from './ui/dev-db-ui-table-empty.tsx'
import { DevDbUiTableNotFound } from './ui/dev-db-ui-table-not-found.tsx'
import { DevDbUiTableRecords } from './ui/dev-db-ui-table-records.tsx'

export function DevFeatureDbList() {
  const { table } = useParams()
  const config = getDevDbTableConfig(table)
  const records = useDevDbRecordsQuery(config)

  if (!config) {
    return <DevDbUiTableNotFound />
  }

  if (records.error) {
    return <UiError message={records.error} />
  }

  return (
    <UiCard
      action={
        <Button asChild size="sm">
          <Link to="create">Create</Link>
        </Button>
      }
      backButtonTo="/dev/db"
      title={config.label}
    >
      {records.loading ? <UiLoader /> : null}
      {!records.loading && records.items.length === 0 ? <DevDbUiTableEmpty config={config} /> : null}
      {records.items.length > 0 ? <DevDbUiTableRecords config={config} items={records.items} /> : null}
    </UiCard>
  )
}
