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
      return createAccountMutation.mutateAsync({ input }).then(
        (accountId) =>
          // After creating the account we can create the wallet
          createWalletMutation.mutateAsync({
            input: {
              ...derivedWallet,
              accountId,
              derivationIndex: 0,
              type: 'Derived',
            },
          }),
        // TODO: - add UI to Accounts -> Generate
        // TODO: - add UI to Accounts -> Import
        // TODO: If we add/import and don't have `activeAccountId` preference, set it
        // TODO: If we add/import and don't have `activeWalletId` preference, set it
        // TODO: If we don't have `activeAccountId` and `activeWalletId`, redirect to onboarding screen
      )
    },
  })
}
