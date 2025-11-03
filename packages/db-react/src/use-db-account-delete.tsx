import { useMutation } from '@tanstack/react-query'
import type { DbAccountDeleteMutateOptions } from './db-account-options.tsx'
import { dbAccountOptions } from './db-account-options.tsx'

export function useDbAccountDelete(props: DbAccountDeleteMutateOptions = {}) {
  return useMutation(dbAccountOptions.delete(props))
}
