import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate, useParams } from 'react-router'
import { getDevDbTableConfig } from './data-access/dev-db-table-config.ts'
import { useDevDbRecordCreate } from './data-access/use-dev-db-record-create.ts'
import { DevDbUiForm } from './ui/dev-db-ui-form.tsx'
import { formatDevDbTablePath } from './ui/dev-db-ui-format.ts'
import { DevDbUiTableNotFound } from './ui/dev-db-ui-table-not-found.tsx'

export function DevFeatureDbCreate() {
  const navigate = useNavigate()
  const { table } = useParams()
  const config = getDevDbTableConfig(table)
  const { createDevDbRecord, creating } = useDevDbRecordCreate(config)

  if (!config) {
    return <DevDbUiTableNotFound />
  }

  const tableConfig = config

  async function createRecord(input: Record<string, unknown>) {
    const result = await createDevDbRecord(input)
    if (!result.ok) {
      return
    }

    const { id } = result
    navigate(
      typeof id === 'string'
        ? `${formatDevDbTablePath(tableConfig.name)}/${id}`
        : formatDevDbTablePath(tableConfig.name),
    )
  }

  return (
    <UiCard backButtonTo={formatDevDbTablePath(tableConfig.name)} title={`Create ${tableConfig.label}`}>
      <DevDbUiForm
        config={tableConfig}
        defaultValues={tableConfig.defaultValues ?? {}}
        mode="create"
        onSubmit={createRecord}
        submitting={creating}
      />
    </UiCard>
  )
}
