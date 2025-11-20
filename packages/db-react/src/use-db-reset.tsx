import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { reset } from '@workspace/db/reset'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useDbReset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await reset(db)
      queryClient.clear()
      toastSuccess('Database reset successfully')
    },
  })
}
