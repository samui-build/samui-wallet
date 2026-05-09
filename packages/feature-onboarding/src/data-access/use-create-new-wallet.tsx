import { useWalletDetermineName } from '@workspace/db-react/use-wallet-determine-name'
import { useWalletGenerateWithAccount } from '@workspace/db-react/use-wallet-generate-with-account'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'

export function useCreateNewWallet() {
  const mutation = useWalletGenerateWithAccount()
  const name = useWalletDetermineName()
  const { requestUnlock } = useVaultUnlockDialog()

  return async (mnemonic: string): Promise<boolean> => {
    const unlocked = await requestUnlock({ mode: 'password', reason: 'createWallet' })
    if (!unlocked) {
      return false
    }

    return mutation
      .mutateAsync({
        derivationPath: derivationPaths.default,
        mnemonic,
        name,
      })
      .then(() => {
        toastSuccess('Wallet created!')
        return true
      })
      .catch((error) => {
        toastError(`${error}`)
        return false
      })
  }
}
