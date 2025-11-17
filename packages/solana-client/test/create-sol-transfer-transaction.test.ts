import { address, blockhash, generateKeyPairSigner } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSolTransferTransaction } from '../src/create-sol-transfer-transaction.ts'

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
      createSolTransferTransaction({
        amount: 100n,
        destination,
        latestBlockhash: {
          blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
          lastValidBlockHeight: 408345595n,
        },
        sender,
      })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith({
        amount: 100n,
        destination,
        source: sender,
      })
    })

    it('should use custom source when provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()
      const source = await generateKeyPairSigner()

      // ACT
      createSolTransferTransaction({
        amount: 500n,
        destination,
        latestBlockhash: {
          blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
          lastValidBlockHeight: 408345595n,
        },
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
      expect.assertions(5)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()
      const testBlockhash = blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb')
      const testBlockHeight = 408345595n

      // ACT
      const result = createSolTransferTransaction({
        amount: 1000000n,
        destination,
        latestBlockhash: {
          blockhash: testBlockhash,
          lastValidBlockHeight: testBlockHeight,
        },
        sender,
      })

      // ASSERT
      expect(result.version).toBe(0)
      expect(result.feePayer).toBe(sender)
      expect(result.lifetimeConstraint.blockhash).toBe(testBlockhash)
      expect(result.lifetimeConstraint.lastValidBlockHeight).toBe(testBlockHeight)
      expect(result.instructions).toHaveLength(1)
    })

    it('should handle destination as string', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = 'So11111111111111111111111111111111111111112'
      const sender = await generateKeyPairSigner()

      // ACT
      createSolTransferTransaction({
        amount: 250n,
        destination,
        latestBlockhash: {
          blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
          lastValidBlockHeight: 408345595n,
        },
        sender,
      })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith({
        amount: 250n,
        destination: address(destination),
        source: sender,
      })
    })

    it('should handle zero amount transfer', async () => {
      // ARRANGE
      expect.assertions(2)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()

      // ACT
      const result = createSolTransferTransaction({
        amount: 0n,
        destination,
        latestBlockhash: {
          blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
          lastValidBlockHeight: 408345595n,
        },
        sender,
      })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 0n,
        }),
      )
      expect(result.instructions).toHaveLength(1)
    })

    it('should handle large amount transfer', async () => {
      // ARRANGE
      expect.assertions(1)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()
      const largeAmount = 18446744073709551615n // Max uint64

      // ACT
      createSolTransferTransaction({
        amount: largeAmount,
        destination,
        latestBlockhash: {
          blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
          lastValidBlockHeight: 408345595n,
        },
        sender,
      })

      // ASSERT
      expect(getTransferSolInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: largeAmount,
        }),
      )
    })

    it('should set correct transaction properties with provided blockhash', async () => {
      // ARRANGE
      expect.assertions(4)
      const destination = address('So11111111111111111111111111111111111111112')
      const sender = await generateKeyPairSigner()
      const testBlockhash = blockhash('9s7BXS3Y6H2QoLPRfaLtK6qXKKH7GcWYoVT7hxXeXm4v')
      const testBlockHeight = 999999999n

      // ACT
      const result = createSolTransferTransaction({
        amount: 5000000n,
        destination,
        latestBlockhash: {
          blockhash: testBlockhash,
          lastValidBlockHeight: testBlockHeight,
        },
        sender,
      })

      // ASSERT
      expect(result.version).toBe(0)
      expect(result.feePayer).toBe(sender)
      expect(result.lifetimeConstraint.blockhash).toBe(testBlockhash)
      expect(result.lifetimeConstraint.lastValidBlockHeight).toBe(testBlockHeight)
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
        createSolTransferTransaction({
          amount: 100n,
          destination: 'invalid-address',
          latestBlockhash: {
            blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
            lastValidBlockHeight: 408345595n,
          },
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
        createSolTransferTransaction({
          amount: 100n,
          destination,
          latestBlockhash: {
            blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
            lastValidBlockHeight: 408345595n,
          },
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
        createSolTransferTransaction({
          amount: 100n,
          destination,
          latestBlockhash: {
            blockhash: blockhash('Bv98hfwcUqonLMt282rBT1dyxqCsuQR5x7mDUL1XrvSb'),
            lastValidBlockHeight: 408345595n,
          },
          sender,
          // @ts-expect-error: Testing invalid input
          source: { address: 'something' },
        }),
      ).toThrow()
    })
  })
})
