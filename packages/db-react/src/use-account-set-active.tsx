import { useMutation } from '@tanstack/react-query'
import type { AccountSetActiveMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useAccountSetActive(props: AccountSetActiveMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsAccount.setActive(ctx, props))
}
