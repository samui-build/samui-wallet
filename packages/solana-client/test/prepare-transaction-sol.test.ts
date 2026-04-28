import { address, generateKeyPairSigner } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { prepareTransactionSol } from '../src/prepare-transaction-sol.ts'

describe('prepare-transaction-sol', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should prepare a sol transaction with transfer instructions', async () => {
      // ARRANGE
      expect.assertions(3)
      const destination = address('So11111111111111111111111111111111111111112')
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = prepareTransactionSol({
        recipients: [{ amount: 100n, destination }],
        senderBalance: 10_000n,
        transactionSigner,
      })

      // ASSERT
      expect(result.instructions).toHaveLength(1)
      expect(result.instructions[0]?.programAddress).toBe('11111111111111111111111111111111')
      expect(result.transactionSigner).toBe(transactionSigner)
    })

    it('should prepare a sol transaction with multiple recipients', async () => {
      // ARRANGE
      expect.assertions(2)
      const destinationAlice = address('So11111111111111111111111111111111111111112')
      const destinationBob = address('So11111111111111111111111111111111111111113')
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = prepareTransactionSol({
        recipients: [
          { amount: 100n, destination: destinationAlice },
          { amount: 42n, destination: destinationBob },
        ],
        senderBalance: 10_000n,
        transactionSigner,
      })

      // ASSERT
      expect(result.instructions).toHaveLength(2)
      expect(result.transactionSigner).toBe(transactionSigner)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw when sender balance cannot cover the amount and fee', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = () =>
        prepareTransactionSol({
          recipients: [{ amount: 1n, destination }],
          senderBalance: 5_000n,
          transactionSigner,
        })

      // ASSERT
      expect(result).toThrow('Insufficient balance')
    })

    it('should throw when recipients are empty', async () => {
      // ARRANGE
      expect.assertions(1)
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = () =>
        prepareTransactionSol({
          recipients: [],
          senderBalance: 10_000n,
          transactionSigner,
        })

      // ASSERT
      expect(result).toThrow('At least one recipient is required')
    })

    it('should throw when a recipient amount is negative', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = () =>
        prepareTransactionSol({
          recipients: [{ amount: -1n, destination }],
          senderBalance: 10_000n,
          transactionSigner,
        })

      // ASSERT
      expect(result).toThrow('Recipient 1 amount must be greater than 0 SOL')
    })

    it('should throw when a recipient amount is zero', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = () =>
        prepareTransactionSol({
          recipients: [{ amount: 0n, destination }],
          senderBalance: 10_000n,
          transactionSigner,
        })

      // ASSERT
      expect(result).toThrow('Recipient 1 amount must be greater than 0 SOL')
    })
  })
})
