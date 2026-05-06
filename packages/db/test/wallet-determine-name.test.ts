import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Wallet } from '../src/wallet/wallet.ts'
import { walletDetermineName } from '../src/wallet/wallet-determine-name.ts'

function createWallet(input: Pick<Wallet, 'name' | 'order'>): Wallet {
  const now = new Date()
  return {
    accounts: [],
    createdAt: now,
    derivationPath: 'd',
    id: input.name,
    name: input.name,
    order: input.order,
    secret: 'secret',
    updatedAt: now,
  }
}

describe('wallet-determine-name', () => {
  describe('expected behavior', () => {
    it('should return the first wallet name when no numbered wallet exists', () => {
      // ARRANGE
      expect.assertions(1)
      const items = [createWallet({ name: 'Primary', order: 0 })]

      // ACT
      const result = walletDetermineName(items)

      // ASSERT
      expect(result).toBe('Wallet 1')
    })

    it('should return the next highest numbered wallet name', () => {
      // ARRANGE
      expect.assertions(1)
      const items = [
        createWallet({ name: 'Primary', order: 0 }),
        createWallet({ name: 'Wallet 1', order: 1 }),
        createWallet({ name: 'Wallet 3', order: 2 }),
      ]

      // ACT
      const result = walletDetermineName(items)

      // ASSERT
      expect(result).toBe('Wallet 4')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should ignore wallet names that are not exact numbered matches', () => {
      // ARRANGE
      expect.assertions(1)
      const items = [
        createWallet({ name: 'Wallet 1 Backup', order: 0 }),
        createWallet({ name: 'Wallet 2', order: 1 }),
        createWallet({ name: 'Wallet Two', order: 2 }),
      ]

      // ACT
      const result = walletDetermineName(items)

      // ASSERT
      expect(result).toBe('Wallet 3')
    })
  })
})
