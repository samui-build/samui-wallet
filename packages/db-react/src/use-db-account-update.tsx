import { useMutation } from '@tanstack/react-query'
import type { DbAccountUpdateMutateOptions } from './db-account-options.tsx'
import { dbAccountOptions } from './db-account-options.tsx'

export function useDbAccountUpdate(props: DbAccountUpdateMutateOptions = {}) {
  return useMutation(dbAccountOptions.update(props))
}
