import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { useGenerateAccountWithWalletMutation } from '@workspace/settings/data-access/use-generate-account-with-wallet-mutation'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useNavigate } from 'react-router'

export function useCreateNewAccount() {
  const mutation = useGenerateAccountWithWalletMutation()
  const navigate = useNavigate()
  return (mnemonic: string) =>
    mutation
      .mutateAsync({
        derivationPath: derivationPaths.default,
        mnemonic,
        name: 'Account 1',
        secret: '',
      })
      .then(() => {
        navigate(`/portfolio`)
        toastSuccess('Account created!')
      })
      .catch(() => toastError(`Error creating account`))
}
