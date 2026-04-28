import { address, generateKeyPairSigner } from '@solana/kit'
import { fetchMint } from '@solana-program/token'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTransferInstructionsSpl } from '../src/create-transfer-instructions-spl.ts'
import { prepareTransactionSpl } from '../src/prepare-transaction-spl.ts'
import type { SolanaClient } from '../src/solana-client.ts'

const mockTokenProgram = vi.hoisted(() => 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
const mockInstructions = vi.hoisted(() => [
  {
    accounts: [],
    data: new Uint8Array(),
    programAddress: mockTokenProgram,
  },
])

vi.mock('@solana-program/token', () => ({
  fetchMint: vi.fn(() => ({
    data: { decimals: 6 },
    programAddress: mockTokenProgram,
  })),
}))

vi.mock('../src/create-transfer-instructions-spl.ts', () => ({
  createTransferInstructionsSpl: vi.fn(() => mockInstructions),
}))

describe('prepare-transaction-spl', () => {
  const client = { rpc: {}, rpcSubscriptions: {} } as SolanaClient
  const mint = address('So11111111111111111111111111111111111111112')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should prepare an spl transaction with transfer instructions', async () => {
      // ARRANGE
      expect.assertions(4)
      const destinationAlice = address('So11111111111111111111111111111111111111113')
      const destinationBob = address('So11111111111111111111111111111111111111114')
      const recipients = [
        { amount: 100n, destination: destinationAlice },
        { amount: 42n, destination: destinationBob },
      ]
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = await prepareTransactionSpl(client, { mint, recipients, transactionSigner })

      // ASSERT
      expect(fetchMint).toHaveBeenCalledWith(client.rpc, mint)
      expect(createTransferInstructionsSpl).toHaveBeenCalledWith({
        decimals: 6,
        mint,
        recipients,
        source: transactionSigner,
        tokenProgram: mockTokenProgram,
        transactionSigner,
      })
      expect(result.instructions).toBe(mockInstructions)
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

    it('should throw when mint address is invalid', async () => {
      // ARRANGE
      expect.assertions(2)
      const destination = address('So11111111111111111111111111111111111111113')
      const transactionSigner = await generateKeyPairSigner()

      // ACT & ASSERT
      await expect(
        prepareTransactionSpl(client, {
          // @ts-expect-error: Testing invalid input
          mint: 'invalid-address',
          recipients: [{ amount: 100n, destination }],
          transactionSigner,
        }),
      ).rejects.toThrow()
      expect(fetchMint).not.toHaveBeenCalled()
    })
  })
})
