import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useParams } from 'react-router'
import { getDevDbTableConfig } from './data-access/dev-db-table-config.ts'
import { useDevDbRecordQuery } from './data-access/use-dev-db-record-query.ts'
import { useDevDbRecordUpdate } from './data-access/use-dev-db-record-update.ts'
import { DevDbUiForm } from './ui/dev-db-ui-form.tsx'
import { formatDevDbTablePath, getDevDbTitle } from './ui/dev-db-ui-format.ts'
import { DevDbUiRecordDetails } from './ui/dev-db-ui-record-details.tsx'
import { DevDbUiRecordNotFound } from './ui/dev-db-ui-record-not-found.tsx'
import { DevDbUiTableNotFound } from './ui/dev-db-ui-table-not-found.tsx'

export function DevFeatureDbUpdate() {
  const { itemId, table } = useParams()
  const config = getDevDbTableConfig(table)
  const record = useDevDbRecordQuery(config, itemId)
  const { updateDevDbRecord, updating } = useDevDbRecordUpdate(config, itemId)

  if (!config || !itemId) {
    return <DevDbUiTableNotFound />
  }

  if (record.error) {
    return <UiError message={record.error} />
  }

  if (record.loading) {
    return <UiLoader />
  }

  if (!record.item) {
    return <DevDbUiRecordNotFound config={config} />
  }

  async function updateRecord(input: Record<string, unknown>) {
    await updateDevDbRecord(input)
  }

  return (
    <div className="space-y-4">
      <UiCard backButtonTo={formatDevDbTablePath(config.name)} title={getDevDbTitle(record.item, config.titleField)}>
        <DevDbUiRecordDetails config={config} item={record.item} />
      </UiCard>
      <UiCard title="Update">
        <DevDbUiForm
          config={config}
          defaultValues={record.item}
          mode="update"
          onSubmit={updateRecord}
          submitting={updating}
        />
      </UiCard>
    </div>
  )
}
