import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { DeriveFromMnemonicAtIndexProps } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { toastError } from '@workspace/ui/lib/toast-error'

export function deriveFromMnemonicMutationOptions() {
  return mutationOptions({
    mutationFn: (input: DeriveFromMnemonicAtIndexProps) => deriveFromMnemonicAtIndex(input),
    onError: (error) => {
      toastError(`Error: ${error.message}`)
    },
  })
}

export function useDeriveFromMnemonic() {
  return useMutation(deriveFromMnemonicMutationOptions())
}
