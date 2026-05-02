import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { devDbTableRecordsQueryKey } from './dev-db-query-keys.ts'
import type { DevDbTableConfig } from './dev-db-table-config.ts'

export function useDevDbRecordCreate(config: DevDbTableConfig | undefined) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (input: Record<string, unknown>) => {
      if (!config) {
        throw new Error('Table not found')
      }

      return config.create(input)
    },
    onError: (error) =>
      toastError(error instanceof Error ? error.message : `Error creating ${config?.label ?? 'record'}`),
    onSuccess: () => {
      if (!config) {
        return
      }

      void queryClient.invalidateQueries({ queryKey: devDbTableRecordsQueryKey(config.name) })
      toastSuccess(`${config.label} record created`)
    },
  })

  async function createDevDbRecord(input: Record<string, unknown>) {
    try {
      return { id: await mutation.mutateAsync(input), ok: true }
    } catch {
      return { ok: false }
    }
  }

  return { createDevDbRecord, creating: mutation.isPending }
}
