import {
  decryptWithPassword,
  encryptWithPassword,
  generateVaultKeyMaterial,
  importVaultKey,
} from './encrypted-value.ts'
import { unlockPinWalletProtection, unlockUnsecuredWalletProtection } from './wallet-protection.ts'
import { walletProtectionSchema } from './wallet-protection-schema.ts'

export interface VaultStorage {
  getVaultKey(): Promise<string | undefined>
  getWalletProtection(walletId: string): Promise<string>
  setVaultKey(value: string): Promise<void>
}

export interface Vault {
  changePassword(input: { newPassword: string; oldPassword: string }): Promise<void>
  create(input: { password: string }): Promise<void>
  isConfigured(): Promise<boolean>
  isUnlocked(): boolean
  lock(): void
  requireDefaultKey(): CryptoKey
  requireWalletKey(input: { walletId: string }): Promise<CryptoKey>
  unlock(input: { password: string }): Promise<void>
  unlockWallet(input: { credential: string; walletId: string }): Promise<void>
}

export function createVault(store: VaultStorage): Vault {
  let key: CryptoKey | null = null
  const walletKeys = new Map<string, CryptoKey>()

  async function getWalletProtection(walletId: string) {
    return walletProtectionSchema.parse(JSON.parse(await store.getWalletProtection(walletId)))
  }

  async function isConfigured(): Promise<boolean> {
    return Boolean(await store.getVaultKey())
  }

  function requireDefaultKey(): CryptoKey {
    if (!key) {
      throw new Error('Vault is locked')
    }
    return key
  }

  return {
    async changePassword({ newPassword, oldPassword }) {
      const encryptedVaultKey = await store.getVaultKey()
      if (!encryptedVaultKey) {
        throw new Error('Vault is not configured')
      }
      try {
        const keyMaterial = await decryptWithPassword({ encrypted: encryptedVaultKey, password: oldPassword })
        await store.setVaultKey(await encryptWithPassword({ password: newPassword, value: keyMaterial }))
        key = await importVaultKey({ keyMaterial })
      } catch (error) {
        throw new Error('Unable to change vault password', { cause: error })
      }
    },
    async create({ password }) {
      if (await isConfigured()) {
        throw new Error('Vault is already configured')
      }
      const keyMaterial = generateVaultKeyMaterial()
      await store.setVaultKey(await encryptWithPassword({ password, value: keyMaterial }))
      key = await importVaultKey({ keyMaterial })
    },
    isConfigured,
    isUnlocked() {
      return key !== null
    },
    lock() {
      key = null
      walletKeys.clear()
    },
    requireDefaultKey,
    async requireWalletKey({ walletId }) {
      const protection = await getWalletProtection(walletId)
      switch (protection.mode) {
        case 'password':
          return requireDefaultKey()
        case 'pin': {
          const walletKey = walletKeys.get(walletId)
          if (!walletKey) {
            throw new Error('Wallet is locked')
          }
          return walletKey
        }
        case 'unsecured': {
          const walletKey = walletKeys.get(walletId)
          if (walletKey) {
            return walletKey
          }
          const newKey = await unlockUnsecuredWalletProtection({ protection: JSON.stringify(protection) })
          walletKeys.set(walletId, newKey)
          return newKey
        }
      }
    },
    async unlock({ password }) {
      const encryptedVaultKey = await store.getVaultKey()
      if (!encryptedVaultKey) {
        throw new Error('Vault is not configured')
      }
      try {
        const keyMaterial = await decryptWithPassword({ encrypted: encryptedVaultKey, password })
        key = await importVaultKey({ keyMaterial })
      } catch (error) {
        key = null
        walletKeys.clear()
        throw new Error('Unable to unlock vault', { cause: error })
      }
    },
    async unlockWallet({ credential, walletId }) {
      const protection = await getWalletProtection(walletId)
      try {
        switch (protection.mode) {
          case 'password':
            requireDefaultKey()
            return
          case 'pin':
            walletKeys.set(
              walletId,
              await unlockPinWalletProtection({ pin: credential, protection: JSON.stringify(protection) }),
            )
            return
          case 'unsecured':
            walletKeys.set(walletId, await unlockUnsecuredWalletProtection({ protection: JSON.stringify(protection) }))
            return
        }
      } catch (error) {
        throw new Error('Unable to unlock wallet', { cause: error })
      }
    },
  }
}
