import { useMutation } from '@tanstack/react-query'
import type { DbAccountCreateMutateOptions } from './db-account-options.tsx'
import { dbAccountOptions } from './db-account-options.tsx'

export function useDbAccountCreate(props: DbAccountCreateMutateOptions = {}) {
  return useMutation(dbAccountOptions.create(props))
}
