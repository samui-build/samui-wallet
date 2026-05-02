import { address, blockhash, compileTransactionMessage, generateKeyPairSigner } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTransferInstructionsSol } from '../src/create-transfer-instructions-sol.ts'
import { createPreparedTransactionMessage } from '../src/prepared-transaction-message.ts'
import type { SolanaClient } from '../src/solana-client.ts'

describe('prepared-transaction-message', () => {
  const latestBlockhash = {
    blockhash: blockhash('11111111111111111111111111111111'),
    lastValidBlockHeight: 1n,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('expected behavior', () => {
    it('should build the shared versioned transaction message', async () => {
      // ARRANGE
      expect.assertions(5)
      const client = { rpc: {}, rpcSubscriptions: {} } as SolanaClient
      const destination = address('So11111111111111111111111111111111111111112')
      const transactionSigner = await generateKeyPairSigner()
      const instructions = createTransferInstructionsSol({
        recipients: [{ amount: 42n, destination }],
        source: transactionSigner,
      })

      // ACT
      const result = await createPreparedTransactionMessage(client, {
        instructions,
        latestBlockhash,
        transactionSigner,
      })
      const compiledMessage = compileTransactionMessage(result.transactionMessage)

      // ASSERT
      expect(compiledMessage.staticAccounts[0]).toBe(transactionSigner.address)
      expect(compiledMessage.staticAccounts).toContain(destination)
      expect(result.latestBlockhash).toBe(latestBlockhash)
      expect(result.transactionMessage.instructions).toStrictEqual(instructions)
      expect(result.transactionMessage.version).toBe(0)
    })

    it('should fetch the latest blockhash when none is provided', async () => {
      // ARRANGE
      expect.assertions(2)
      const send = vi.fn(async () => ({ value: latestBlockhash }))
      const client = {
        rpc: {
          getLatestBlockhash: vi.fn(() => ({ send })),
        },
        rpcSubscriptions: {},
      } as unknown as SolanaClient
      const transactionSigner = await generateKeyPairSigner()

      // ACT
      const result = await createPreparedTransactionMessage(client, {
        instructions: [],
        transactionSigner,
      })

      // ASSERT
      expect(client.rpc.getLatestBlockhash).toHaveBeenCalledWith()
      expect(result.latestBlockhash).toBe(latestBlockhash)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should surface an rpc failure when latest blockhash fetch fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const error = new Error('rpc failed')
      const send = vi.fn(async () => {
        throw error
      })
      const client = {
        rpc: {
          getLatestBlockhash: vi.fn(() => ({ send })),
        },
        rpcSubscriptions: {},
      } as unknown as SolanaClient
      const transactionSigner = await generateKeyPairSigner()

      // ACT & ASSERT
      await expect(
        createPreparedTransactionMessage(client, {
          instructions: [],
          transactionSigner,
        }),
      ).rejects.toThrow(error)
    })
  })
})
