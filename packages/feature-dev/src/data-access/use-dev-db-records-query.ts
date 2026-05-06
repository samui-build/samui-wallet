import { queryOptions, useQuery } from '@tanstack/react-query'
import type { DbRecord } from '@workspace/db/db-table-metadata'
import { devDbTableRecordsQueryKey } from './dev-db-query-keys.ts'
import type { DevDbTableConfig } from './dev-db-table-config.ts'
import { getDevDbTableRecords } from './dev-db-table-config.ts'

function devDbRecordsQueryOptions(config: DevDbTableConfig | undefined) {
  return queryOptions({
    enabled: !!config,
    queryFn: async () => {
      if (!config) {
        throw new Error('Table not found')
      }

      return sortDevDbRecords(config, await getDevDbTableRecords(config))
    },
    queryKey: devDbTableRecordsQueryKey(config?.name),
  })
}

export function useDevDbRecordsQuery(config: DevDbTableConfig | undefined) {
  const query = useQuery(devDbRecordsQueryOptions(config))

  return { error: query.error, items: query.data ?? [], loading: query.isLoading }
}

function sortDevDbRecords(config: DevDbTableConfig, items: DbRecord[]) {
  return [...items].sort((itemA, itemB) => {
    const valueA = formatDevDbSortValue(itemA[config.titleField] ?? itemA.id)
    const valueB = formatDevDbSortValue(itemB[config.titleField] ?? itemB.id)
    return valueA.localeCompare(valueB)
  })
}

function formatDevDbSortValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return String(value ?? '')
}
