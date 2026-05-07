import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppContext } from '@workspace/db-react/use-app-context'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { devDbTableRecordQueryKey, devDbTableRecordsQueryKey } from './dev-db-query-keys.ts'
import type { DevDbTableConfig } from './dev-db-table-config.ts'

export function useDevDbRecordUpdate(config: DevDbTableConfig | undefined, id: string | undefined) {
  const ctx = useAppContext()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (input: Record<string, unknown>) => {
      if (!config || !id) {
        throw new Error('Record not found')
      }

      return config.update(ctx, id, input)
    },
    onError: (error) =>
      toastError(error instanceof Error ? error.message : `Error updating ${config?.label ?? 'record'}`),
    onSuccess: () => {
      if (!config || !id) {
        return
      }

      void queryClient.invalidateQueries({ queryKey: devDbTableRecordQueryKey(config.name, id) })
      void queryClient.invalidateQueries({ queryKey: devDbTableRecordsQueryKey(config.name) })
      toastSuccess(`${config.label} record updated`)
    },
  })

  async function updateDevDbRecord(input: Record<string, unknown>) {
    try {
      await mutation.mutateAsync(input)
      return true
    } catch {
      return false
    }
  }

  return { updateDevDbRecord, updating: mutation.isPending }
}
