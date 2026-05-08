import { VAULT_PASSWORD_MAX_LENGTH } from '@workspace/vault/encrypted-value-schema'
import { createVault, type VaultStorage } from '@workspace/vault/vault'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { submitVaultPassword } from '../src/data-access/vault-password-submit.ts'

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

describe('submit-vault-password', () => {
  beforeEach(() => {
    vaultKey = undefined
  })

  describe('expected behavior', () => {
    it('should create a vault when one is not configured', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)

      // ACT
      const result = await submitVaultPassword(vault, {
        confirmPassword: 'password-one',
        password: 'password-one',
      })

      // ASSERT
      expect(result).toBe('configured')
      expect(vaultKey).toBeDefined()
      expect(vault.isUnlocked()).toBe(true)
    })

    it('should create a vault without a confirm password when one is not configured', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)

      // ACT
      const result = await submitVaultPassword(vault, { password: 'password-one' })

      // ASSERT
      expect(result).toBe('configured')
      expect(vaultKey).toBeDefined()
      expect(vault.isUnlocked()).toBe(true)
    })

    it('should unlock a configured vault', async () => {
      // ARRANGE
      expect.assertions(2)
      const vault1 = createVault(storage)
      await vault1.create({ password: 'password-one' })
      vault1.lock()
      const vault2 = createVault(storage)

      // ACT
      const result = await submitVaultPassword(vault2, { password: 'password-one' })

      // ASSERT
      expect(result).toBe('unlocked')
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

    it('should reject mismatched setup passwords', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)

      // ACT & ASSERT
      await expect(
        submitVaultPassword(vault, {
          confirmPassword: 'password-two',
          password: 'password-one',
        }),
      ).rejects.toThrow('Passwords do not match')
    })

    it('should reject short setup passwords', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)

      // ACT & ASSERT
      await expect(
        submitVaultPassword(vault, {
          confirmPassword: 'short',
          password: 'short',
        }),
      ).rejects.toThrow('Password must be at least 8 characters')
    })

    it('should reject long setup passwords', async () => {
      // ARRANGE
      expect.assertions(1)
      const password = 'a'.repeat(VAULT_PASSWORD_MAX_LENGTH + 1)
      const vault = createVault(storage)

      // ACT & ASSERT
      await expect(
        submitVaultPassword(vault, {
          confirmPassword: password,
          password,
        }),
      ).rejects.toThrow(`Password must be at most ${VAULT_PASSWORD_MAX_LENGTH} characters`)
    })

    it('should reject the wrong unlock password', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })
      vault.lock()

      // ACT & ASSERT
      await expect(submitVaultPassword(vault, { password: 'wrong-password' })).rejects.toThrow('Unable to unlock vault')
    })
  })
})
