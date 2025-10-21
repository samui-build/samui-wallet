import { useMutation } from '@tanstack/react-query'

import type { DbWalletSetActiveMutateOptions } from './db-wallet-options'

import { dbWalletOptions } from './db-wallet-options'

export function useDbWalletSetActive(props: DbWalletSetActiveMutateOptions = {}) {
  return useMutation(dbWalletOptions.setActive(props))
}
