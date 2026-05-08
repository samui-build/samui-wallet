import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { AccountUpdateOrderMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountUpdateOrder(props: AccountUpdateOrderMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.updateOrder(ctx, props))
}
