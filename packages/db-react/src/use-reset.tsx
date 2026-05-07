import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AppContext } from '@workspace/db/app-context'
import { reset } from '@workspace/db/reset'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useAppContext } from './use-app-context.tsx'

export function resetMutationOptions(ctx: AppContext, queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: async () => {
      await reset(ctx)
      queryClient.clear()
      toastSuccess('Database reset successfully')
    },
  })
}

export function useReset() {
  const ctx = useAppContext()
  const queryClient = useQueryClient()

  return useMutation(resetMutationOptions(ctx, queryClient))
}
