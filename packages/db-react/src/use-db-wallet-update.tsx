import { useMutation } from '@tanstack/react-query'

import type { DbWalletUpdateMutateOptions } from './db-wallet-options'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletUpdate(props: DbWalletUpdateMutateOptions = {}) {
  return useMutation(dbWalletOptions.update(props))
}
