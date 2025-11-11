import { address, blockhash, generateKeyPairSigner } from '@solana/kit'
import { getCreateAssociatedTokenInstruction, getTransferCheckedInstruction } from '@solana-program/token'
import { describe, expect, it, vi } from 'vitest'
import { createSplTransferTransaction } from '../src/create-spl-transfer-transaction.ts'

vi.mock('@solana-program/token', () => ({
  getCreateAssociatedTokenInstruction: vi.fn(),
  getTransferCheckedInstruction: vi.fn(),
  TOKEN_PROGRAM_ADDRESS: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
}))

describe('create-spl-transfer-transaction', () => {
  describe('expected behavior', () => {
    it('should create transfer instruction correctly', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT
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
      })

      // ASSERT
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
    })

    it('should create account instruction when destination does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const sender = await generateKeyPairSigner()
      const mint = address('So11111111111111111111111111111111111111112')
      const destination = address('So11111111111111111111111111111111111111113')
      const sourceTokenAccount = address('So11111111111111111111111111111111111111114')
      const destinationTokenAccount = address('So11111111111111111111111111111111111111115')

      // ACT
      createSplTransferTransaction({
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

      // ASSERT
      expect(getCreateAssociatedTokenInstruction).toHaveBeenCalledWith({
        ata: destinationTokenAccount,
        mint,
        owner: destination,
        payer: sender,
        tokenProgram: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
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
  })
})
