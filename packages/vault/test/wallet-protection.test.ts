import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { decryptWithVaultKey, encryptWithVaultKey } from '../src/encrypted-value.ts'
import { VAULT_PIN_MAX_LENGTH } from '../src/encrypted-value-schema.ts'
import { createVault, type VaultStorage } from '../src/vault.ts'
import {
  createPasswordWalletProtection,
  createPinWalletProtection,
  createUnsecuredWalletProtection,
  isWalletProtection,
  unlockPinWalletProtection,
  unlockUnsecuredWalletProtection,
} from '../src/wallet-protection.ts'

let vaultKey: string | undefined
const walletProtections = new Map<string, string>()
const storage: VaultStorage = {
  async getVaultKey() {
    return vaultKey
  },
  async getWalletProtection(walletId) {
    const protection = walletProtections.get(walletId)
    if (!protection) {
      throw new Error(`Wallet with id ${walletId} not found`)
    }

    return protection
  },
  async setVaultKey(value) {
    vaultKey = value
  },
}

describe('wallet-protection', () => {
  beforeEach(() => {
    vaultKey = undefined
    walletProtections.clear()
  })

  describe('expected behavior', () => {
    it('should resolve password protection to the vault password key', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })
      const walletId = createWallet(createPasswordWalletProtection())

      // ACT
      const protection = readWalletProtection(walletId)
      const key = await vault.requireWalletKey({ walletId })
      const encrypted = await encryptWithVaultKey({ key, value: 'secret value' })
      const result = await decryptWithVaultKey({ encrypted, key: vault.requireDefaultKey() })

      // ASSERT
      expect(isWalletProtection(protection)).toBe(true)
      expect(JSON.parse(protection)).toEqual({ mode: 'password', version: 1 })
      expect(result).toBe('secret value')
    })

    it('should unlock PIN protection with the correct PIN', async () => {
      // ARRANGE
      expect.assertions(4)
      const vault = createVault(storage)
      const protection = await createPinWalletProtection({ pin: '1234' })
      const walletId = createWallet(protection)

      // ACT
      await vault.unlockWallet({ credential: '1234', walletId })
      const key = await vault.requireWalletKey({ walletId })
      const encrypted = await encryptWithVaultKey({ key, value: 'secret value' })
      const result = await decryptWithVaultKey({ encrypted, key })

      // ASSERT
      expect(isWalletProtection(protection)).toBe(true)
      expect(JSON.parse(protection).mode).toBe('pin')
      expect(protection).not.toContain('1234')
      expect(result).toBe('secret value')
    })

    it('should import unsecured protection without a credential', async () => {
      // ARRANGE
      expect.assertions(4)
      const vault = createVault(storage)
      const protection = createUnsecuredWalletProtection()
      const walletId = createWallet(protection)

      // ACT
      const key = await vault.requireWalletKey({ walletId })
      const key2 = await vault.requireWalletKey({ walletId })
      const encrypted = await encryptWithVaultKey({ key, value: 'secret value' })
      const result = await decryptWithVaultKey({ encrypted, key })

      // ASSERT
      expect(isWalletProtection(protection)).toBe(true)
      expect(JSON.parse(protection).mode).toBe('unsecured')
      expect(key2).toBe(key)
      expect(result).toBe('secret value')
    })

    it('should not expose another wallet key when one wallet is unsecured', async () => {
      // ARRANGE
      expect.assertions(2)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })
      const passwordWalletId = createWallet(createPasswordWalletProtection())
      const unsecuredWalletId = createWallet(createUnsecuredWalletProtection())
      vault.lock()

      // ACT & ASSERT
      await expect(vault.requireWalletKey({ walletId: unsecuredWalletId })).resolves.toBeDefined()
      await expect(vault.requireWalletKey({ walletId: passwordWalletId })).rejects.toThrow('Vault is locked')
    })

    it('should clear cached PIN wallet keys on lock', async () => {
      // ARRANGE
      expect.assertions(2)
      const vault = createVault(storage)
      const protection = await createPinWalletProtection({ pin: '1234' })
      const walletId = createWallet(protection)
      await vault.unlockWallet({ credential: '1234', walletId })

      // ACT
      const result = await vault.requireWalletKey({ walletId })
      vault.lock()

      // ASSERT
      expect(result).toBeDefined()
      await expect(vault.requireWalletKey({ walletId })).rejects.toThrow('Wallet is locked')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should reject a short PIN', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(createPinWalletProtection({ pin: '123' })).rejects.toThrow('PIN must be at least 4 digits')
    })

    it('should reject a long PIN', async () => {
      // ARRANGE
      expect.assertions(1)
      const pin = '1'.repeat(VAULT_PIN_MAX_LENGTH + 1)

      // ACT & ASSERT
      await expect(createPinWalletProtection({ pin })).rejects.toThrow(
        `PIN must be at most ${VAULT_PIN_MAX_LENGTH} digits`,
      )
    })

    it('should reject the wrong PIN', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createVault(storage)
      const protection = await createPinWalletProtection({ pin: '1234' })
      const walletId = createWallet(protection)

      // ACT & ASSERT
      await expect(vault.unlockWallet({ credential: '9999', walletId })).rejects.toMatchObject({
        cause: expect.objectContaining({ message: 'Unable to unlock wallet protection' }),
        message: 'Unable to unlock wallet',
      })
    })

    it('should clear cached PIN wallet keys when unlock fails', async () => {
      // ARRANGE
      expect.assertions(3)
      const vault = createVault(storage)
      await vault.create({ password: 'password-one' })
      const protection = await createPinWalletProtection({ pin: '1234' })
      const walletId = createWallet(protection)
      await vault.unlockWallet({ credential: '1234', walletId })

      // ACT
      const result = await vault.requireWalletKey({ walletId })

      // ASSERT
      expect(result).toBeDefined()
      await expect(vault.unlock({ password: 'wrong-password' })).rejects.toMatchObject({
        cause: expect.objectContaining({ message: 'Unable to decrypt value' }),
        message: 'Unable to unlock vault',
      })
      await expect(vault.requireWalletKey({ walletId })).rejects.toThrow('Wallet is locked')
    })

    it('should reject a non-digit PIN', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(createPinWalletProtection({ pin: 'abcd' })).rejects.toThrow('PIN must contain only digits')
    })

    it('should reject malformed PIN protection with a curated error', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(unlockPinWalletProtection({ pin: '1234', protection: 'not-json' })).rejects.toMatchObject({
        cause: expect.any(SyntaxError),
        message: 'Unable to unlock wallet protection',
      })
    })

    it('should reject malformed unsecured protection with a curated error', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(unlockUnsecuredWalletProtection({ protection: 'not-json' })).rejects.toMatchObject({
        cause: expect.any(SyntaxError),
        message: 'Unable to unlock wallet protection',
      })
    })
  })
})

function createWallet(secret: string): string {
  const id = `wallet-${walletProtections.size + 1}`
  walletProtections.set(id, secret)

  return id
}

function readWalletProtection(id: string): string {
  const protection = walletProtections.get(id)
  if (!protection) {
    throw new Error(`Wallet with id ${id} not found`)
  }

  return protection
}
