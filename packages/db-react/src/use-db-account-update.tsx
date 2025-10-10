import { useMutation } from '@tanstack/react-query'

import type { DbAccountUpdateMutateOptions } from './db-account-options'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountUpdate(props: DbAccountUpdateMutateOptions = {}) {
  return useMutation(dbAccountOptions.update(props))
}
