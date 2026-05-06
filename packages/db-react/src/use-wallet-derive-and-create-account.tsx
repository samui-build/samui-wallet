import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useAccountCreate } from './use-account-create.tsx'
import { useAccountDeriveFromMnemonic } from './use-account-derive-from-mnemonic.tsx'
import { useWalletReadMnemonic } from './use-wallet-read-mnemonic.tsx'

export function walletDeriveAndCreateAccountMutationOptions({
  createAccountMutation,
  deriveFromMnemonicMutation,
  readMnemonicMutation,
}: {
  createAccountMutation: ReturnType<typeof useAccountCreate>
  deriveFromMnemonicMutation: ReturnType<typeof useAccountDeriveFromMnemonic>
  readMnemonicMutation: ReturnType<typeof useWalletReadMnemonic>
}) {
  return mutationOptions({
    mutationFn: async ({ index, item }: { index: number; item: Wallet }) => {
      const mnemonic = await readMnemonicMutation.mutateAsync({ id: item.id })
      const derivedAccount = await deriveFromMnemonicMutation.mutateAsync({
        derivationIndex: index,
        derivationPath: item.derivationPath,
        mnemonic,
      })
      await createAccountMutation.mutateAsync({
        input: {
          ...derivedAccount,
          derivationIndex: index,
          name: ellipsify(derivedAccount.publicKey),
          type: 'Derived',
          walletId: item.id,
        },
      })
    },
  })
}

export function useWalletDeriveAndCreateAccount() {
  const createAccountMutation = useAccountCreate()
  const deriveFromMnemonicMutation = useAccountDeriveFromMnemonic()
  const readMnemonicMutation = useWalletReadMnemonic()

  return useMutation(
    walletDeriveAndCreateAccountMutationOptions({
      createAccountMutation,
      deriveFromMnemonicMutation,
      readMnemonicMutation,
    }),
  )
}
