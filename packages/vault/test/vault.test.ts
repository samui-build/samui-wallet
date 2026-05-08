import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createVault, type VaultStorage } from '../src/vault.ts'

let vaultKey: string | undefined
const storage: VaultStorage = {
  async getVaultKey() {
    return vaultKey
  },
  async getWalletProtection() {
    throw new Error('Wallet protection is not configured')
  },
  async setVaultKey(value) {
    vaultKey = value
  },
}

describe('vault', () => {
  beforeEach(() => {
    vaultKey = undefined
  })

  describe('expected behavior', () => {
    it('should create and store a wrapped vault key', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)

      // ACT
      await vault.create({ password: 'password-one' })

      // ASSERT
      expect(vaultKey).toBeDefined()
      expect(vaultKey).not.toContain('password-one')
      expect(vault.isUnlocked()).toBe(true)
    })

    it('should unlock an existing vault', async () => {
      // ARRANGE
      expect.assertions(2)
      const vault1 = createVault(storage)
      await vault1.create({ password: 'password-one' })
      vault1.lock()
      const vault2 = createVault(storage)

      // ACT
      await vault2.unlock({ password: 'password-one' })

      // ASSERT
      expect(vault1.isUnlocked()).toBe(false)
      expect(vault2.isUnlocked()).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should reject unlock before setup', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)

      // ACT & ASSERT
      await expect(vault.unlock({ password: 'password-one' })).rejects.toThrow('Vault is not configured')
    })

    it('should stay locked when create persistence fails', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault({
        async getVaultKey() {
          return undefined
        },
        async getWalletProtection() {
          throw new Error('Wallet protection is not configured')
        },
        async setVaultKey() {
          throw new Error('storage unavailable')
        },
      })

      // ACT & ASSERT
      await expect(vault.create({ password: 'password-one' })).rejects.toThrow('storage unavailable')
      expect(vault.isUnlocked()).toBe(false)
      await expect(vault.isConfigured()).resolves.toBe(false)
    })

    it('should stay locked when create rejects a short password', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)

      // ACT & ASSERT
      await expect(vault.create({ password: 'short' })).rejects.toThrow('Password must be at least 8 characters')
      expect(vault.isUnlocked()).toBe(false)
      await expect(vault.isConfigured()).resolves.toBe(false)
    })

    it('should clear stale state when unlock fails', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })

      // ACT & ASSERT
      await expect(vault.unlock({ password: 'wrong-password' })).rejects.toMatchObject({
        cause: expect.objectContaining({ message: 'Unable to decrypt value' }),
        message: 'Unable to unlock vault',
      })
      expect(vault.isUnlocked()).toBe(false)
      expect(() => vault.requireDefaultKey()).toThrow('Vault is locked')
    })

    it('should preserve the original error when changing password fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })

      // ACT & ASSERT
      await expect(
        vault.changePassword({ newPassword: 'password-two', oldPassword: 'wrong-password' }),
      ).rejects.toMatchObject({
        cause: expect.objectContaining({ message: 'Unable to decrypt value' }),
        message: 'Unable to change vault password',
      })
    })

    it('should reject wrong password', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })
      vault.lock()

      // ACT & ASSERT
      await expect(vault.unlock({ password: 'wrong-password' })).rejects.toMatchObject({
        cause: expect.objectContaining({ message: 'Unable to decrypt value' }),
        message: 'Unable to unlock vault',
      })
    })
  })
})
