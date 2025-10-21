import { useMutation } from '@tanstack/react-query'

import type { DbAccountSetActiveMutateOptions } from './db-account-options'

import { dbAccountOptions } from './db-account-options'

export function useDbAccountSetActive(props: DbAccountSetActiveMutateOptions = {}) {
  return useMutation(dbAccountOptions.setActive(props))
}
