import { useMutation } from '@tanstack/react-query'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { useAccountCreate } from '@workspace/db-react/use-account-create'
import { useWalletReadMnemonic } from '@workspace/db-react/use-wallet-read-mnemonic'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useDeriveFromMnemonic } from './use-derive-from-mnemonic.tsx'

export function useDeriveAndCreateAccount() {
  const createAccountMutation = useAccountCreate()
  const deriveFromMnemonicMutation = useDeriveFromMnemonic()
  const readMnemonicMutation = useWalletReadMnemonic()
  return useMutation({
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
