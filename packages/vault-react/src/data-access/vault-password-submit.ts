import { i18n } from '@workspace/i18n'
import { VAULT_PASSWORD_MAX_LENGTH, VAULT_PASSWORD_MIN_LENGTH } from '@workspace/vault/encrypted-value-schema'
import type { Vault } from '@workspace/vault/vault'

export type VaultPasswordSubmitInput = {
  confirmPassword?: string | undefined
  password: string
  passwordMaxLength?: number | undefined
  passwordMinLength?: number | undefined
}

export type VaultPasswordSubmitResult = 'configured' | 'unlocked'

export async function submitVaultPassword(
  vault: Vault,
  {
    confirmPassword,
    password,
    passwordMaxLength = VAULT_PASSWORD_MAX_LENGTH,
    passwordMinLength = VAULT_PASSWORD_MIN_LENGTH,
  }: VaultPasswordSubmitInput,
): Promise<VaultPasswordSubmitResult> {
  if (await vault.isConfigured()) {
    await vault.unlock({ password })
    return 'unlocked'
  }

  if (password.length < passwordMinLength) {
    throw new Error(i18n.t(($) => $.unlockDialogPasswordMinLengthMessage, { ns: 'vault-react', passwordMinLength }))
  }
  if (password.length > passwordMaxLength) {
    throw new Error(i18n.t(($) => $.unlockDialogPasswordMaxLengthMessage, { ns: 'vault-react', passwordMaxLength }))
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new Error(i18n.t(($) => $.unlockDialogPasswordMismatchMessage, { ns: 'vault-react' }))
  }

  await vault.create({ password })
  return 'configured'
}
