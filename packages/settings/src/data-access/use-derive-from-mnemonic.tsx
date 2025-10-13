import type { DeriveFromMnemonicAtIndexProps } from '@workspace/keypair/derive-from-mnemonic-at-index'

import { useMutation } from '@tanstack/react-query'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { toastError } from '@workspace/ui/lib/toast-error'

export function useDeriveFromMnemonic() {
  return useMutation({
    mutationFn: (input: DeriveFromMnemonicAtIndexProps) => deriveFromMnemonicAtIndex(input),
    onError: (error) => {
      toastError(`Error: ${error.message}`)
    },
  })
}
