import type { DeriveFromMnemonicAtIndexProps } from '@workspace/keypair/derive-from-mnemonic-at-index'

import { useMutation } from '@tanstack/react-query'
import { ellipsify } from '@workspace/core/ellipsify'
import { deriveFromMnemonicAtIndex } from '@workspace/keypair/derive-from-mnemonic-at-index'
import { toastError } from '@workspace/ui/lib/toast-error'

export function useDeriveFromMnemonic() {
  return useMutation({
    mutationFn: (input: DeriveFromMnemonicAtIndexProps) =>
      deriveFromMnemonicAtIndex(input).then((wallet) => ({
        ...wallet,
        name: ellipsify(wallet.publicKey),
      })),
    onError: (error) => {
      toastError(`Error: ${error}`)
    },
  })
}
