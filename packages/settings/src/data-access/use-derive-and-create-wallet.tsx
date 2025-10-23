import type { Account } from '@workspace/db/entity/account'

import { useMutation } from '@tanstack/react-query'
import { useDbWalletCreate } from '@workspace/db-react/use-db-wallet-create'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import { useDeriveFromMnemonic } from './use-derive-from-mnemonic.js'

export function useDeriveAndCreateWallet() {
  const createWalletMutation = useDbWalletCreate()
  const deriveFromMnemonicMutation = useDeriveFromMnemonic()

  return useMutation({
    mutationFn: async ({ index, item }: { index: number; item: Account }) => {
      const derivedWallet = await deriveFromMnemonicMutation.mutateAsync({
        derivationIndex: index,
        derivationPath: item.derivationPath,
        mnemonic: item.mnemonic,
      })
      await createWalletMutation.mutateAsync({
        input: {
          ...derivedWallet,
          accountId: item.id,
          derivationIndex: index,
          name: ellipsify(derivedWallet.publicKey),
          type: 'Derived',
        },
      })
    },
  })
}
