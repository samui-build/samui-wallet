import { useMutation } from '@tanstack/react-query'
import type { DbAccountSetActiveMutateOptions } from './db-account-options.tsx'
import { dbAccountOptions } from './db-account-options.tsx'

export function useDbAccountSetActive(props: DbAccountSetActiveMutateOptions = {}) {
  return useMutation(dbAccountOptions.setActive(props))
}
