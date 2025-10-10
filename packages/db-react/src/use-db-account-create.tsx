import { useMutation } from '@tanstack/react-query'

import type { DbAccountCreateMutateOptions } from './db-account-options'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountCreate(props: DbAccountCreateMutateOptions = {}) {
  return useMutation(dbAccountOptions.create(props))
}
