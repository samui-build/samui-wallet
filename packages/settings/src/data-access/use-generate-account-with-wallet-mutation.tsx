import type { AccountInputCreate } from '@workspace/db/dto/account-input-create'

import { useMutation } from '@tanstack/react-query'
import { useDbAccountCreate } from '@workspace/db-react/use-db-account-create'
import { useDbWalletCreate } from '@workspace/db-react/use-db-wallet-create'

import { useDeriveFromMnemonic } from './use-derive-from-mnemonic.js'

export function useGenerateAccountWithWalletMutation() {
  const createAccountMutation = useDbAccountCreate()
  const createWalletMutation = useDbWalletCreate()
  const deriveWalletMutation = useDeriveFromMnemonic()

  return useMutation({
    mutationFn: async (input: AccountInputCreate) => {
      // First, we see if we can derive the first wallet from this mnemonic
      const derivedWallet = await deriveWalletMutation.mutateAsync({ mnemonic: input.mnemonic })
      // If so, we create the account
      const accountId = await createAccountMutation.mutateAsync({ input })
      // After creating the account we can create the wallet
      await createWalletMutation.mutateAsync({
        input: {
          ...derivedWallet,
          accountId,
          type: 'Derived',
        },
      })
      return accountId
    },
  })
}
