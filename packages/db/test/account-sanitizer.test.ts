import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AccountInternal } from '../src/account/account-internal.ts'
import { accountSanitizer } from '../src/account/account-sanitizer.ts'

describe('account-sanitizer', () => {
  describe('expected behavior', () => {
    it('should remove the secret key from an account', () => {
      // ARRANGE
      expect.assertions(2)
      const now = new Date()
      const input = {
        createdAt: now,
        derivationIndex: 0,
        id: 'account-id',
        name: 'Account',
        order: 0,
        publicKey: address('So11111111111111111111111111111111111111112'),
        secretKey: 'secret-key',
        type: 'Imported',
        updatedAt: now,
        walletId: 'wallet-id',
      } satisfies AccountInternal

      // ACT
      const result = accountSanitizer(input)

      // ASSERT
      expect(result.name).toBe(input.name)
      expect(result).not.toHaveProperty('secretKey')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when account data is invalid', () => {
      // ARRANGE
      expect.assertions(1)
      const now = new Date()
      const input = {
        createdAt: now,
        derivationIndex: 0,
        id: 'account-id',
        name: ' ',
        order: 0,
        publicKey: address('So11111111111111111111111111111111111111112'),
        secretKey: 'secret-key',
        type: 'Imported',
        updatedAt: now,
        walletId: 'wallet-id',
      } satisfies AccountInternal

      // ACT & ASSERT
      expect(() => accountSanitizer(input)).toThrow()
    })
  })
})
