import { useMutation } from '@tanstack/react-query'

import type { DbWalletDeleteMutateOptions } from './db-wallet-options'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletDelete(props: DbWalletDeleteMutateOptions = {}) {
  return useMutation(dbWalletOptions.delete(props))
}
