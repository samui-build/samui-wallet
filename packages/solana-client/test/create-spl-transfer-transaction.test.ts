import { address, generateKeyPairSigner } from '@solana/kit'
import { getCreateAssociatedTokenIdempotentInstruction, getTransferCheckedInstruction } from '@solana-program/token'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSplTransferInstructions } from '../src/create-spl-transfer-instructions.ts'

vi.mock('@solana-program/token', () => ({
  findAssociatedTokenPda: vi.fn(() => []),
  getCreateAssociatedTokenIdempotentInstruction: vi.fn(() => address('So11111111111111111111111111111111111111112')),
  getTransferCheckedInstruction: vi.fn(() => ({
    accounts: [],
    programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  })),
  TOKEN_PROGRAM_ADDRESS: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
}))

describe('create-spl-transfer-transaction', async () => {
  const transactionSigner = await generateKeyPairSigner()
  const mint = address('So11111111111111111111111111111111111111112')
  const destination = address('So11111111111111111111111111111111111111113')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should create complete transaction with transfer instruction when ATA exists', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      const result = await createSplTransferInstructions({
        decimals: 6,
        mint,
        recipients: [{ amount: 1000000n, destination }],
        transactionSigner,
      })

      // ASSERT - Multiple assertions checking different aspects
      expect(getTransferCheckedInstruction).toHaveBeenCalledTimes(1)
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        {
          amount: 1000000n,
          authority: transactionSigner,
          decimals: 6,
          destination: undefined,
          mint,
          source: undefined,
        },
        {
          programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        },
      )
      expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)
    })

    it('should create ATA and transfer instructions when destination ATA does not exist', async () => {
      // ARRANGE
      expect.assertions(5)

      // ACT
      const result = await createSplTransferInstructions({
        decimals: 9,
        mint,
        recipients: [{ amount: 500000n, destination }],
        transactionSigner,
      })

      // ASSERT - Check both instructions are created in correct order
      expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledTimes(1)
      expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith({
        ata: undefined,
        mint,
        owner: destination,
        payer: transactionSigner,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
      expect(getTransferCheckedInstruction).toHaveBeenCalledTimes(1)
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        {
          amount: 500000n,
          authority: transactionSigner,
          decimals: 9,
          destination: undefined,
          mint,
          source: undefined,
        },
        {
          programAddress: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        },
      )
      expect(result).toHaveLength(2)
    })

    it('should use custom source as authority when provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const source = await generateKeyPairSigner()

      // ACT
      await createSplTransferInstructions({
        decimals: 6,
        mint,
        recipients: [{ amount: 750000n, destination }],
        source, // Custom source authority
        transactionSigner,
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
          authority: transactionSigner,
        }),
        expect.anything(),
      )
    })

    it('should use custom token program when provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const customTokenProgram = address('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')

      // ACT
      await createSplTransferInstructions({
        decimals: 6,
        mint,
        recipients: [{ amount: 1000000n, destination }],
        tokenProgram: customTokenProgram,
        transactionSigner,
      })

      // ASSERT - Verify custom token program is used
      expect(getCreateAssociatedTokenIdempotentInstruction).toHaveBeenCalledWith(
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

      // ACT
      const result = await createSplTransferInstructions({
        decimals: 6,
        mint,
        recipients: [{ amount: 0n, destination }],
        transactionSigner,
      })

      // ASSERT
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 0n,
        }),
        expect.anything(),
      )
      expect(result).toHaveLength(2)
    })

    it('should handle large amount transfer', async () => {
      // ARRANGE
      expect.assertions(1)
      const largeAmount = 18446744073709551615n // Max uint64

      // ACT
      await createSplTransferInstructions({
        decimals: 0,
        mint,
        recipients: [{ amount: largeAmount, destination }],
        transactionSigner,
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

      // ACT
      await createSplTransferInstructions({
        decimals: 9, // Wrapped SOL uses 9 decimals
        mint,
        recipients: [{ amount: 1000000000n, destination }],
        transactionSigner,
      })

      // ASSERT
      expect(getTransferCheckedInstruction).toHaveBeenCalledWith(
        expect.objectContaining({ decimals: 9 }),
        expect.anything(),
      )
    })
  })

  describe('unexpected behavior', () => {
    it('should throw error when mint address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(
        createSplTransferInstructions({
          decimals: 6,
          // @ts-expect-error: Testing invalid input
          mint: 'invalid-address',
          recipients: [{ amount: 1000000n, destination }],
          transactionSigner,
        }),
      ).rejects.toThrow()
    })

    it('should throw error when destination address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(
        createSplTransferInstructions({
          decimals: 6,
          mint,
          recipients: [
            {
              amount: 1000000n,
              // @ts-expect-error: Testing invalid input
              destination: 'bad-address',
            },
          ],
          transactionSigner,
        }),
      ).rejects.toThrow()
    })

    it('should throw error when token program address is invalid', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(
        createSplTransferInstructions({
          amount: 1000000n,
          decimals: 6,
          destination,
          mint,
          // @ts-expect-error: Testing invalid input
          tokenProgram: 'not-valid',
          transactionSigner,
        }),
      ).rejects.toThrow()
    })

    it('should throw error when source is provided but not a keypair signer', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(
        createSplTransferInstructions({
          amount: 1000000n,
          decimals: 6,
          destination,
          mint,
          // @ts-expect-error: Invalid source
          source: { address: 'something' },
          transactionSigner,
        }),
      ).rejects.toThrow()
    })
  })
})
