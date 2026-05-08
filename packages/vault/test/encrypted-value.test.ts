import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  decryptWithPassword,
  decryptWithVaultKey,
  encryptWithPassword,
  encryptWithVaultKey,
  generateVaultKeyMaterial,
  importVaultKey,
  isEncryptedValue,
} from '../src/encrypted-value.ts'
import {
  encryptedValueSchema,
  VAULT_PASSWORD_MAX_LENGTH,
  VAULT_PASSWORD_MIN_LENGTH,
  VAULT_PIN_MAX_LENGTH,
  VAULT_PIN_MIN_LENGTH,
  vaultCredentialPolicySchema,
} from '../src/encrypted-value-schema.ts'

describe('encrypted-value', () => {
  describe('expected behavior', () => {
    it('should decrypt a value encrypted with the same password', async () => {
      // ARRANGE
      expect.assertions(2)
      const password = 'correct horse battery staple'
      const value = 'secret value'

      // ACT
      const encrypted = await encryptWithPassword({ password, value })
      const result = await decryptWithPassword({ encrypted, password })

      // ASSERT
      expect(encrypted).not.toContain(value)
      expect(result).toBe(value)
    })

    it('should decrypt a value encrypted with the same raw vault key', async () => {
      // ARRANGE
      expect.assertions(2)
      const key = await importVaultKey({ keyMaterial: generateVaultKeyMaterial() })
      const value = 'secret value'

      // ACT
      const encrypted = await encryptWithVaultKey({ key, value })
      const result = await decryptWithVaultKey({ encrypted, key })

      // ASSERT
      expect(encrypted).not.toContain(value)
      expect(result).toBe(value)
    })

    it('should validate credential policies with bounded lengths', () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result1 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PASSWORD_MAX_LENGTH,
        minLength: VAULT_PASSWORD_MIN_LENGTH,
        mode: 'password',
      })
      const result2 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PIN_MAX_LENGTH,
        minLength: VAULT_PIN_MIN_LENGTH,
        mode: 'pin',
      })

      // ASSERT
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should reject a short password', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(encryptWithPassword({ password: 'short', value: 'secret value' })).rejects.toThrow(
        'Password must be at least 8 characters',
      )
    })

    it('should reject a long password', async () => {
      // ARRANGE
      expect.assertions(2)
      const password = 'a'.repeat(VAULT_PASSWORD_MAX_LENGTH + 1)
      const encrypted = await encryptWithPassword({ password: 'correct-password', value: 'secret value' })

      // ACT & ASSERT
      await expect(encryptWithPassword({ password, value: 'secret value' })).rejects.toThrow(
        `Password must be at most ${VAULT_PASSWORD_MAX_LENGTH} characters`,
      )
      await expect(decryptWithPassword({ encrypted, password })).rejects.toThrow(
        `Password must be at most ${VAULT_PASSWORD_MAX_LENGTH} characters`,
      )
    })

    it('should reject credential policies above maximum lengths', () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      const result1 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PASSWORD_MAX_LENGTH + 1,
        minLength: VAULT_PASSWORD_MIN_LENGTH,
        mode: 'password',
      })
      const result2 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PIN_MAX_LENGTH + 1,
        minLength: VAULT_PIN_MIN_LENGTH,
        mode: 'pin',
      })
      const result3 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PASSWORD_MAX_LENGTH,
        minLength: VAULT_PASSWORD_MAX_LENGTH + 1,
        mode: 'password',
      })
      const result4 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PIN_MAX_LENGTH,
        minLength: VAULT_PIN_MAX_LENGTH + 1,
        mode: 'pin',
      })

      // ASSERT
      expect(result1.success).toBe(false)
      expect(result2.success).toBe(false)
      expect(result3.success).toBe(false)
      expect(result4.success).toBe(false)
    })

    it('should reject credential policies with minimums above maximums', () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result1 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PASSWORD_MIN_LENGTH,
        minLength: VAULT_PASSWORD_MIN_LENGTH + 1,
        mode: 'password',
      })
      const result2 = vaultCredentialPolicySchema.safeParse({
        maxLength: VAULT_PIN_MIN_LENGTH,
        minLength: VAULT_PIN_MIN_LENGTH + 1,
        mode: 'pin',
      })

      // ASSERT
      expect(result1.success).toBe(false)
      expect(result2.success).toBe(false)
    })

    it('should reject encrypted value envelopes with invalid KDF params', () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result1 = encryptedValueSchema.safeParse({
        auth_tag: 'tag',
        cipher: 'aes-256-gcm',
        cipherparams: {
          iv: 'iv',
        },
        ciphertext: 'ciphertext',
        kdf: 'pbkdf2-sha256',
        version: 1,
      })
      const result2 = encryptedValueSchema.safeParse({
        auth_tag: 'tag',
        cipher: 'aes-256-gcm',
        cipherparams: {
          iv: 'iv',
        },
        ciphertext: 'ciphertext',
        kdf: 'direct',
        kdfparams: {
          dklen: 32,
          hash: 'sha256',
          iterations: 600_000,
          salt: 'salt',
        },
        version: 1,
      })

      // ASSERT
      expect(result1.success).toBe(false)
      expect(result2.success).toBe(false)
    })

    it('should reject a wrong password', async () => {
      // ARRANGE
      expect.assertions(1)
      const encrypted = await encryptWithPassword({ password: 'correct-password', value: 'secret value' })

      // ACT & ASSERT
      await expect(decryptWithPassword({ encrypted, password: 'wrong-password' })).rejects.toThrow(
        'Unable to decrypt value',
      )
    })

    it('should return false for malformed encrypted values', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = isEncryptedValue('secret value')

      // ASSERT
      expect(result).toBe(false)
    })
  })
})
