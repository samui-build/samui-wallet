import { useMutation } from '@tanstack/react-query'
import type { AccountUpdateOrderMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountUpdateOrder(props: AccountUpdateOrderMutateOptions = {}) {
  return useMutation(optionsAccount.updateOrder(props))
}
