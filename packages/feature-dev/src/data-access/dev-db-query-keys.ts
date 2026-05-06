import type { DevDbTableConfig } from './dev-db-table-config.ts'

export function devDbTableRecordQueryKey(table: DevDbTableConfig['name'] | undefined, id: string | undefined) {
  return ['dev-db', table, 'record', id] as const
}

export function devDbTableRecordsQueryKey(table: DevDbTableConfig['name'] | undefined) {
  return ['dev-db', table, 'records'] as const
}
