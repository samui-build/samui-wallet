import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { reset } from '@workspace/db/reset'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function resetMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async () => {
      await reset(db)
      queryClient.clear()
      toastSuccess('Database reset successfully')
    },
  })
}

export function useReset() {
  const queryClient = useQueryClient()

  return useMutation(resetMutationOptions(queryClient))
}
