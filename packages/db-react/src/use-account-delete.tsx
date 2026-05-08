import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { AccountDeleteMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountDelete(props: AccountDeleteMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.delete(ctx, props))
}
