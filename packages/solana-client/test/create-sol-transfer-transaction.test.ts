import { address, generateKeyPairSigner } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSolTransferInstructions } from '../src/create-sol-transfer-instructions.ts'

vi.mock('@solana-program/system', () => ({
  getTransferSolInstruction: vi.fn(() => ({
    accounts: [],
    programAddress: address('11111111111111111111111111111111'),
  })),
}))

describe('create-sol-transfer-transaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should receive correct amount, destination and sender', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()

      // ACT
      createSolTransferInstructions({ amount: 100n, destination, sender })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith({ amount: 100n, destination, source: sender })
    })

    it('should use custom source when provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()
      const source = await generateKeyPairSigner()

      // ACT
      createSolTransferInstructions({
        amount: 500n,
        destination,
        sender,
        source,
      })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith({
        amount: 500n,
        destination,
        source,
      })
      expect(getTransferSolInstruction).not.toHaveBeenCalledWith(
        expect.objectContaining({
          source: sender,
        }),
      )
    })

    it('should return properly structured transaction message', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()

      // ACT
      const result = createSolTransferInstructions({
        amount: 1000000n,
        destination,
        sender,
      })

      // ASSERT
      expect(result).toHaveLength(1)
    })

    it('should handle zero amount transfer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()

      // ACT
      createSolTransferInstructions({ amount: 0n, destination, sender })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 0n,
        }),
      )
    })

    it('should handle large amount transfer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()
      const largeAmount = 18446744073709551615n // Max uint64

      // ACT
      createSolTransferInstructions({ amount: largeAmount, destination, sender })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith(expect.objectContaining({ amount: largeAmount }))
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw error when destination is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()

      // ACT & ASSERT
      expect(() =>
        createSolTransferInstructions({
          amount: 100n,
          // @ts-expect-error: Testing invalid input
          destination: 'invalid-address',
          sender,
        }),
      ).toThrow()
    })

    it('should throw error when sender is not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')

      // ACT & ASSERT
      expect(() =>
        createSolTransferInstructions({
          amount: 100n,
          destination,
          // @ts-expect-error: Testing invalid input
          sender: {},
        }),
      ).toThrow()
    })

    it('should throw error when source is provided but not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()

      // ACT & ASSERT
      expect(() =>
        createSolTransferInstructions({
          amount: 100n,
          destination,
          sender,
          // @ts-expect-error: Testing invalid input
          source: { address: 'something' },
        }),
      ).toThrow()
    })
  })
})
