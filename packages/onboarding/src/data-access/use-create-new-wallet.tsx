import { useWalletDetermineName } from '@workspace/db-react/use-wallet-determine-name'
import { useWalletGenerateWithAccount } from '@workspace/db-react/use-wallet-generate-with-account'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useCreateNewWallet() {
  const mutation = useWalletGenerateWithAccount()
  const name = useWalletDetermineName()
  return (mnemonic: string) =>
    mutation
      .mutateAsync({
        derivationPath: derivationPaths.default,
        mnemonic,
        name,
        secret: '',
      })
      .then(() => {
        toastSuccess('Wallet created!')
      })
      .catch(() => toastError(`Error creating wallet`))
}
