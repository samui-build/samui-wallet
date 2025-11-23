import { useMutation } from '@tanstack/react-query'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { useAccountCreate } from '@workspace/db-react/use-account-create'
import { useWalletCreate } from '@workspace/db-react/use-wallet-create'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import { useDeriveFromMnemonic } from './use-derive-from-mnemonic.tsx'

export function useGenerateWalletWithAccountMutation() {
  const createWalletMutation = useWalletCreate()
  const createAccountMutation = useAccountCreate()
  const deriveAccountMutation = useDeriveFromMnemonic()

  return useMutation({
    mutationFn: async (input: WalletCreateInput) => {
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
