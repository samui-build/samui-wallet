import { generateKeyPairSigner, isSignature } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import {
  type CreateAndSendSolTransactionOptions,
  createAndSendSolTransaction,
} from '../src/create-and-send-sol-transaction.ts'
import { getBalance } from '../src/get-balance.ts'
import { setupIntegrationTestContext } from './test-helpers.ts'

describe('create-and-send-sol-transaction', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()

  describe('expected behavior', () => {
    it('should create and send sol', async () => {
      // ARRANGE
      expect.assertions(2)
      const destinationKeypair = await generateKeyPairSigner()
      const destination = destinationKeypair.address
      const senderBalance = await getBalance(client, { address: transactionSigner.address }).then((res) => res.value)
      const input: CreateAndSendSolTransactionOptions = {
        amount: 100n,
        destination,
        latestBlockhash,
        senderBalance,
        transactionSigner,
      }

      // ACT
      const result = await createAndSendSolTransaction(client, input)

      // ASSERT
      const res = await getBalance(client, { address: destination }).then((res) => res.value)
      expect(res).toBe(input.amount)
      expect(isSignature(result)).toBeTruthy()
    })
  })
})
