import { useMutation } from '@tanstack/react-query'
import type { AccountSetActiveMutateOptions } from './options-account.tsx'
import { optionsAccount } from './options-account.tsx'

export function useAccountSetActive(props: AccountSetActiveMutateOptions = {}) {
  return useMutation(optionsAccount.setActive(props))
}
