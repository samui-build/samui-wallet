import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WalletInternal } from '../src/wallet/wallet-internal.ts'
import { walletSanitizer } from '../src/wallet/wallet-sanitizer.ts'

describe('wallet-sanitizer', () => {
  describe('expected behavior', () => {
    it('should remove the mnemonic and secret from a wallet', () => {
      // ARRANGE
      expect.assertions(3)
      const now = new Date()
      const input = {
        accounts: [],
        createdAt: now,
        derivationPath: 'd',
        id: 'wallet-id',
        mnemonic: 'mnemonic',
        name: 'Wallet',
        order: 0,
        secret: 'secret',
        updatedAt: now,
      } satisfies WalletInternal

      // ACT
      const result = walletSanitizer(input)

      // ASSERT
      expect(result.name).toBe(input.name)
      expect(result).not.toHaveProperty('mnemonic')
      expect(result).not.toHaveProperty('secret')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when wallet data is invalid', () => {
      // ARRANGE
      expect.assertions(1)
      const now = new Date()
      const input = {
        accounts: [],
        createdAt: now,
        derivationPath: 'd',
        id: 'wallet-id',
        mnemonic: 'mnemonic',
        name: ' ',
        order: 0,
        secret: 'secret',
        updatedAt: now,
      } satisfies WalletInternal

      // ACT & ASSERT
      expect(() => walletSanitizer(input)).toThrow()
    })
  })
})
