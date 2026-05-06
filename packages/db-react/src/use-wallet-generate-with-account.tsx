import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useAccountCreate } from './use-account-create.tsx'
import { useAccountDeriveFromMnemonic } from './use-account-derive-from-mnemonic.tsx'
import { useWalletCreate } from './use-wallet-create.tsx'

export function walletGenerateWithAccountMutationOptions({
  createAccountMutation,
  createWalletMutation,
  deriveAccountMutation,
}: {
  createAccountMutation: ReturnType<typeof useAccountCreate>
  createWalletMutation: ReturnType<typeof useWalletCreate>
  deriveAccountMutation: ReturnType<typeof useAccountDeriveFromMnemonic>
}) {
  return mutationOptions({
    mutationFn: async (input: WalletCreateInput) => {
      // First, we see if we can derive the first account from this mnemonic
      const derivedAccount = await deriveAccountMutation.mutateAsync({
        derivationPath: input.derivationPath,
        mnemonic: input.mnemonic,
      })
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

export function useWalletGenerateWithAccount() {
  const createAccountMutation = useAccountCreate()
  const createWalletMutation = useWalletCreate()
  const deriveAccountMutation = useAccountDeriveFromMnemonic()

  return useMutation(
    walletGenerateWithAccountMutationOptions({
      createAccountMutation,
      createWalletMutation,
      deriveAccountMutation,
    }),
  )
}
