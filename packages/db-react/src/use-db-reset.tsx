import { useMutation } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbReset } from '@workspace/db/db-reset'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useDbReset() {
  return useMutation({
    mutationFn: async () => {
      await dbReset(db)
      toastSuccess('Database reset successfully')
    },
  })
}
