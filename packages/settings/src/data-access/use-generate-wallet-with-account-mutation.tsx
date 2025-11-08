import { useMutation } from '@tanstack/react-query'
import type { WalletInputCreate } from '@workspace/db/dto/wallet-input-create'
import { useDbAccountCreate } from '@workspace/db-react/use-db-account-create'
import { useDbWalletCreate } from '@workspace/db-react/use-db-wallet-create'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import { useDeriveFromMnemonic } from './use-derive-from-mnemonic.tsx'

export function useGenerateWalletWithAccountMutation() {
  const createWalletMutation = useDbWalletCreate()
  const createAccountMutation = useDbAccountCreate()
  const deriveAccountMutation = useDeriveFromMnemonic()

  return useMutation({
    mutationFn: async (input: WalletInputCreate) => {
      // First, we see if we can derive the first account from this mnemonic
      const derivedAccount = await deriveAccountMutation.mutateAsync({ mnemonic: input.mnemonic })
      // If so, we create the wallet
      const walletId = await createWalletMutation.mutateAsync({ input })
      // After creating the wallet we can create the account
      await createAccountMutation.mutateAsync({
        input: {
          ...derivedAccount,
          name: ellipsify(derivedAccount.publicKey),
          type: 'Derived',
          walletId,
        },
      })
      return walletId
    },
  })
}
