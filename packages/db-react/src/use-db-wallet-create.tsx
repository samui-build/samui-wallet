import { useMutation } from '@tanstack/react-query'

import type { DbWalletCreateMutateOptions } from './db-wallet-options'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletCreate(props: DbWalletCreateMutateOptions = {}) {
  return useMutation(dbWalletOptions.create(props))
}
