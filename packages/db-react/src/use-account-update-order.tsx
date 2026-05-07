import { useMutation } from '@tanstack/react-query'
import type { AccountUpdateOrderMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useAccountUpdateOrder(props: AccountUpdateOrderMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.updateOrder(ctx, props))
}
