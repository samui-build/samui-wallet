import { useMutation } from '@tanstack/react-query'

import type { DbAccountDeleteMutateOptions } from './db-account-options'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountDelete(props: DbAccountDeleteMutateOptions = {}) {
  return useMutation(dbAccountOptions.delete(props))
}
