import { address, blockhash, generateKeyPairSigner } from '@solana/kit'
import { getCreateAssociatedTokenInstruction, getTransferCheckedInstruction } from '@solana-program/token'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSplTransferTransaction } from '../src/create-spl-transfer-transaction.ts'

vi.mock('@solana-program/token', () => ({
  getCreateAssociatedTokenInstruction: vi.fn(() => ({
    accounts: [],
    programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  })),
  getTransferCheckedInstruction: vi.fn(() => ({
    accounts: [],
    programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  })),
  TOKEN_PROGRAM_ADDRESS: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
}))

describe('create-spl-transfer-transaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should create complete transaction with transfer instruction when ATA exists', async () => {
      // ARRANGE
      expect.assertions(8)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')
      const testBlockhash = blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh')

      // ACT
      const result = createSplTransferTransaction({
        amount: '1000000',
        decimals: 6,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: true,
        latestBlockhash: {
          blockhash: testBlockhash,
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        sourceTokenAccount,
      })

      // ASSERT - Multiple assertions checking different aspects
      expect(getTransferCheckedInstruction).toHaveBeenCalledTimes(1)
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        {
          amount: 1000000n,
          authority: sender,
          decimals: 6,
          destination: destinationTokenAccount,
          mint,
          source: sourceTokenAccount,
        },
        {
          programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        },
      )
      expect(getCreateAssociatedTokenInstruction).not.toHaveBeenCalled()
      expect(result.version).toBe(0)
      expect(result.feePayer).toBe(sender) // feePayer is the sender object, not sender.address
      expect(result.lifetimeConstraint.blockhash).toBe(testBlockhash)
      expect(result.lifetimeConstraint.lastValidBlockHeight).toBe(408781140n)
      expect(result.instructions).toHaveLength(1)
    })

    it('should create ATA and transfer instructions when destination ATA does not exist', async () => {
      // ARRANGE
      expect.assertions(5)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT
      const result = createSplTransferTransaction({
        amount: '500000',
        decimals: 9,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: false,
        latestBlockhash: {
          blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        sourceTokenAccount,
      })

      // ASSERT - Check both instructions are created in correct order
      expect(getCreateAssociatedTokenInstruction).toHaveBeenCalledTimes(1)
      expect(getCreateAssociatedTokenInstruction).toHaveBeenCalledWith({
        ata: destinationTokenAccount,
        mint,
        owner: destination,
        payer: sender,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
      expect(getTransferCheckedInstruction).toHaveBeenCalledTimes(1)
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        {
          amount: 500000n,
          authority: sender,
          decimals: 9,
          destination: destinationTokenAccount,
          mint,
          source: sourceTokenAccount,
        },
        {
          programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        },
      )
      expect(result.instructions).toHaveLength(2)
    })

    it('should use custom source as authority when provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const sender = await generateKeyPairSigner()
      const source = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT
      createSplTransferTransaction({
        amount: '750000',
        decimals: 6,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: true,
        latestBlockhash: {
          blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        source, // Custom source authority
        sourceTokenAccount,
      })

      // ASSERT - Verify source is used as authority instead of sender
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          authority: source, // Should use source, not sender
        }),
        expect.anything(),
      )
      expect(getTransferCheckedInstruction).not.toHaveBeenCalledWith(
        expect.objectContaining({
          authority: sender,
        }),
        expect.anything(),
      )
    })

    it('should use custom token program when provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')
      const customTokenProgram = address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')

      // ACT
      createSplTransferTransaction({
        amount: '1000000',
        decimals: 6,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: false,
        latestBlockhash: {
          blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        sourceTokenAccount,
        tokenProgram: customTokenProgram,
      })

      // ASSERT - Verify custom token program is used
      expect(getCreateAssociatedTokenInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenProgram: customTokenProgram,
        }),
      )
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(expect.anything(), {
        programAddress: customTokenProgram,
      })
    })

    it('should handle zero amount transfer', async () => {
      // ARRANGE
      expect.assertions(2)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT
      const result = createSplTransferTransaction({
        amount: '0',
        decimals: 6,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: true,
        latestBlockhash: {
          blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        sourceTokenAccount,
      })

      // ASSERT
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 0n,
        }),
        expect.anything(),
      )
      expect(result.instructions).toHaveLength(1)
    })

    it('should handle large amount transfer', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')
      const largeAmount = '18446744073709551615' // Max uint64

      // ACT
      createSplTransferTransaction({
        amount: largeAmount,
        decimals: 0,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: true,
        latestBlockhash: {
          blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        sourceTokenAccount,
      })

      // ASSERT
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: BigInt(largeAmount),
        }),
        expect.anything(),
      )
    })

    it('should handle different decimal precisions', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT
      createSplTransferTransaction({
        amount: '1000000000',
        decimals: 9, // Wrapped SOL uses 9 decimals
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: true,
        latestBlockhash: {
          blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
          lastValidBlockHeight: 408781140n,
        },
        mint,
        sender,
        sourceTokenAccount,
      })

      // ASSERT
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          decimals: 9,
        }),
        expect.anything(),
      )
    })

    it('should set correct transaction properties with provided blockhash', async () => {
      // ARRANGE
      expect.assertions(4)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')
      // Use a valid base58 blockhash format
      const testBlockhash = blockhash('9s7BXS3Y6H2QoLPRfaLtK6qXKKH7GcWYoVT7hxXeXm4v')
      const testBlockHeight = 999999999n

      // ACT
      const result = createSplTransferTransaction({
        amount: '1000',
        decimals: 6,
        destination,
        destinationTokenAccount,
        destinationTokenAccountExists: true,
        latestBlockhash: {
          blockhash: testBlockhash,
          lastValidBlockHeight: testBlockHeight,
        },
        mint,
        sender,
        sourceTokenAccount,
      })

      // ASSERT
      expect(result.version).toBe(0)
      expect(result.feePayer).toBe(sender) // feePayer is the sender object
      expect(result.lifetimeConstraint.blockhash).toBe(testBlockhash)
      expect(result.lifetimeConstraint.lastValidBlockHeight).toBe(testBlockHeight)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw error when mint address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination,
          destinationTokenAccount,
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint: 'invalid-address',
          sender,
          sourceTokenAccount,
        }),
      ).toThrow()
    })

    it('should throw error when source token account address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination,
          destinationTokenAccount,
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint,
          sender,
          sourceTokenAccount: 'not-a-valid-address',
        }),
      ).toThrow()
    })

    it('should throw error when destination token account address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination,
          destinationTokenAccount: 'invalid',
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint,
          sender,
          sourceTokenAccount,
        }),
      ).toThrow()
    })

    it('should throw error when destination address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination: 'bad-address',
          destinationTokenAccount,
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint,
          sender,
          sourceTokenAccount,
        }),
      ).toThrow()
    })

    it('should throw error when token program address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination,
          destinationTokenAccount,
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint,
          sender,
          sourceTokenAccount,
          tokenProgram: 'not-valid',
        }),
      ).toThrow()
    })

    it('should throw error when sender is not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination,
          destinationTokenAccount,
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint,
          // @ts-expect-error: Invalid sender
          sender: {},
          sourceTokenAccount,
        }),
      ).toThrow()
    })

    it('should throw error when source is provided but not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT & ASSERT
      expect(() =>
        createSplTransferTransaction({
          amount: '1000000',
          decimals: 6,
          destination,
          destinationTokenAccount,
          destinationTokenAccountExists: true,
          latestBlockhash: {
            blockhash: blockhash('8RgfL7JKoPe4gwCGkCS1HwRHKTdG8TgQX1ncTFwkh2zh'),
            lastValidBlockHeight: 408781140n,
          },
          mint,
          sender,
          // @ts-expect-error: Invalid source
          source: { address: 'something' },
          sourceTokenAccount,
        }),
      ).toThrow()
    })
  })
})
