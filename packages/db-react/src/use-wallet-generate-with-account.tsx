import { mutationOptions, useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useAccountCreate } from './use-account-create.tsx'
import { useAccountDeriveFromMnemonic } from './use-account-derive-from-mnemonic.tsx'
import { useWalletCreate } from './use-wallet-create.tsx'

export function walletGenerateWithAccountMutationOptions({
  createAccountMutation,
  createWalletMutation,
  deriveAccountMutation,
  unlockWallet,
}: {
  createAccountMutation: ReturnType<typeof useAccountCreate>
  createWalletMutation: ReturnType<typeof useWalletCreate>
  deriveAccountMutation: ReturnType<typeof useAccountDeriveFromMnemonic>
  unlockWallet: (input: { credential: string; walletId: string }) => Promise<void>
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

      if (input.protection?.mode === 'pin') {
        await unlockWallet({ credential: input.protection.pin, walletId })
      }

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
  const context = useAppContext()
  const createAccountMutation = useAccountCreate()
  const createWalletMutation = useWalletCreate()
  const deriveAccountMutation = useAccountDeriveFromMnemonic()

  return useMutation(
    walletGenerateWithAccountMutationOptions({
      createAccountMutation,
      createWalletMutation,
      deriveAccountMutation,
      unlockWallet: (input) => context.vault.unlockWallet(input),
    }),
  )
}
