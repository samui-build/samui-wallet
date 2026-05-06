import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { networkGetLabel } from '../src/network/network-get-label.ts'
import type { NetworkType } from '../src/network/network-type.ts'

describe('network-get-label', () => {
  describe('expected behavior', () => {
    it.each([
      ['solana:devnet', 'Solana Devnet'],
      ['solana:localnet', 'Solana Localnet'],
      ['solana:mainnet', 'Solana Mainnet'],
      ['solana:testnet', 'Solana Testnet'],
    ] satisfies [NetworkType, string][])('should get the label for %s', (type, label) => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = networkGetLabel(type)

      // ASSERT
      expect(result).toBe(label)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return an unknown label for an unsupported network type', () => {
      // ARRANGE
      expect.assertions(1)
      // @ts-expect-error: Testing invalid input
      const type: NetworkType = 'solana:custom'

      // ACT
      const result = networkGetLabel(type)

      // ASSERT
      expect(result).toBe('Unknown network solana:custom')
    })
  })
})
