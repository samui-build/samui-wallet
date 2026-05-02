import { devDbTableConfigs } from './data-access/dev-db-table-config.ts'
import { DevDbUiTableIndex } from './ui/dev-db-ui-table-index.tsx'

export function DevFeatureDbIndex() {
  return <DevDbUiTableIndex configs={devDbTableConfigs} />
}
