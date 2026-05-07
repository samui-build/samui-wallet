import { queryOptions, useQuery } from '@tanstack/react-query'
import type { AppContext } from '@workspace/db/app-context'
import { useAppContext } from '@workspace/db-react/use-app-context'
import { devDbTableRecordQueryKey } from './dev-db-query-keys.ts'
import type { DevDbTableConfig } from './dev-db-table-config.ts'
import { getDevDbTableRecord } from './dev-db-table-config.ts'

function devDbRecordQueryOptions(ctx: AppContext, config: DevDbTableConfig | undefined, id: string | undefined) {
  return queryOptions({
    enabled: !!config && !!id,
    queryFn: async () => {
      if (!config || !id) {
        throw new Error('Record not found')
      }

      return (await getDevDbTableRecord(ctx, config, id)) ?? null
    },
    queryKey: devDbTableRecordQueryKey(config?.name, id),
  })
}

export function useDevDbRecordQuery(config: DevDbTableConfig | undefined, id: string | undefined) {
  const ctx = useAppContext()
  const query = useQuery(devDbRecordQueryOptions(ctx, config, id))

  return {
    error: query.error,
    item: query.data ?? null,
    loading: query.isLoading,
  }
}
