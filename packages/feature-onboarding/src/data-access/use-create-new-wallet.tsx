import { useWalletDetermineName } from '@workspace/db-react/use-wallet-determine-name'
import { useWalletGenerateWithAccount } from '@workspace/db-react/use-wallet-generate-with-account'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { VAULT_PIN_MAX_LENGTH, VAULT_PIN_MIN_LENGTH } from '@workspace/vault/encrypted-value-schema'
import { useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'

export type CreateNewWalletProtection = { mode: 'password' } | { mode: 'pin'; pin: string } | { mode: 'unsecured' }

export type CreateNewWalletProtectionMode = CreateNewWalletProtection['mode']

export function useCreateNewWallet() {
  const mutation = useWalletGenerateWithAccount()
  const name = useWalletDetermineName()
  const { requestUnlock } = useVaultUnlockDialog()

  return async (mnemonic: string, input?: CreateNewWalletProtection): Promise<boolean> => {
    const protection = input ?? { mode: 'password' }
    if (protection.mode === 'password') {
      const unlocked = await requestUnlock({ mode: 'password', reason: 'createWallet' })
      if (!unlocked) {
        return false
      }
    }

    return mutation
      .mutateAsync({
        derivationPath: derivationPaths.default,
        mnemonic,
        name,
        protection,
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

export function getCreateNewWalletProtection(input: {
  pin: string
  pinConfirm: string
  protectionMode: CreateNewWalletProtectionMode
  unsecuredConfirmed: boolean
}): CreateNewWalletProtection {
  switch (input.protectionMode) {
    case 'password':
      return { mode: 'password' }
    case 'pin':
      if (!new RegExp(`^\\d{${VAULT_PIN_MIN_LENGTH},${VAULT_PIN_MAX_LENGTH}}$`).test(input.pin)) {
        throw new Error(`PIN must be ${VAULT_PIN_MIN_LENGTH}-${VAULT_PIN_MAX_LENGTH} digits`)
      }
      if (input.pin !== input.pinConfirm) {
        throw new Error('PINs do not match')
      }
      return { mode: 'pin', pin: input.pin }
    case 'unsecured':
      if (!input.unsecuredConfirmed) {
        throw new Error('Confirm this wallet is not protected')
      }
      return { mode: 'unsecured' }
  }
}

export function parseCreateNewWalletProtectionMode(value: string): CreateNewWalletProtectionMode {
  switch (value) {
    case 'pin':
    case 'unsecured':
      return value
    default:
      return 'password'
  }
}
