import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { useGenerateWalletWithAccountMutation } from '@workspace/settings/data-access/use-generate-wallet-with-account-mutation'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useCreateNewWallet() {
  const mutation = useGenerateWalletWithAccountMutation()
  return (mnemonic: string) =>
    mutation
      .mutateAsync({
        derivationPath: derivationPaths.default,
        mnemonic,
        name: 'Wallet 1',
        secret: '',
      })
      .then(() => {
        toastSuccess('Wallet created!')
      })
      .catch(() => toastError(`Error creating wallet`))
}
