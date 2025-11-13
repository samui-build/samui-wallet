import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbReset } from '@workspace/db/db-reset'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useDbReset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await dbReset(db)
      queryClient.clear()
      toastSuccess('Database reset successfully')
    },
  })
}
