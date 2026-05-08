import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { AccountSetActiveMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountSetActive(props: AccountSetActiveMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.setActive(ctx, props))
}
