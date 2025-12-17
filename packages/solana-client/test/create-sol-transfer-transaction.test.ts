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
    it('should receive correct amount, destination and source', async () => {
      // ARRANGE
      expect.assertions(2)
      const destination = address('So11111111111111111111111111111111111111112')
      const source = await generateKeyPairSigner()

      // ACT
      createSolTransferInstructions({ recipients: [{ amount: 100n, destination }], source })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledTimes(1)
      expect(getTransferSolInstruction).toHaveBeenCalledWith({ amount: 100n, destination, source })
    })

    it('should receive correct amount, destination and source for multiple recipients', async () => {
      // ARRANGE
      expect.assertions(3)
      const destinationAlice = address('So11111111111111111111111111111111111111112')
      const destinationBob = address('So11111111111111111111111111111111111111113')
      const source = await generateKeyPairSigner()

      // ACT
      createSolTransferInstructions({
        recipients: [
          { amount: 100n, destination: destinationAlice },
          { amount: 42n, destination: destinationBob },
        ],
        source,
      })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledTimes(2)
      expect(getTransferSolInstruction).toHaveBeenCalledWith({ amount: 100n, destination: destinationAlice, source })
      expect(getTransferSolInstruction).toHaveBeenCalledWith({ amount: 42n, destination: destinationBob, source })
    })

    it('should return properly structured transaction message', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const source = await generateKeyPairSigner()

      // ACT
      const result = createSolTransferInstructions({ recipients: [{ amount: 1000000n, destination }], source })

      // ASSERT
      expect(result).toHaveLength(1)
    })

    it('should handle zero amount transfer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const source = await generateKeyPairSigner()

      // ACT
      createSolTransferInstructions({ recipients: [{ amount: 0n, destination }], source })

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
      const source = await generateKeyPairSigner()
      const largeAmount = 18446744073709551615n // Max uint64

      // ACT
      createSolTransferInstructions({ recipients: [{ amount: largeAmount, destination }], source })

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
      const source = await generateKeyPairSigner()

      // ACT & ASSERT
      expect(() =>
        createSolTransferInstructions({
          recipients: [
            {
              amount: 100n,
              // @ts-expect-error: Testing invalid input
              destination: 'invalid-address',
            },
          ],
          source,
        }),
      ).toThrow()
    })

    it('should throw error when source is not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')

      // ACT & ASSERT
      expect(() =>
        createSolTransferInstructions({
          amount: 100n,
          destination,
          // @ts-expect-error: Testing invalid input
          source: {},
        }),
      ).toThrow()
    })

    it('should throw error when source is provided but not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')

      // ACT & ASSERT
      expect(() =>
        createSolTransferInstructions({
          amount: 100n,
          destination,
          // @ts-expect-error: Testing invalid input
          source: { address: 'something' },
        }),
      ).toThrow()
    })
  })
})
