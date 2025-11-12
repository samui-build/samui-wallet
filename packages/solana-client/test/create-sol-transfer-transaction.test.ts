import { address, blockhash, generateKeyPairSigner } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'
import { describe, expect, it, vi } from 'vitest'
import { createSolTransferTransaction } from '../src/create-sol-transfer-transaction.ts'

vi.mock('@solana-program/system', () => ({
  getTransferSolInstruction: vi.fn(),
}))

describe('create-sol-transfer-transaction', () => {
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
  })
})
