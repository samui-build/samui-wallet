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
        latestBlockhash,
        recipients: [
          {
            amount: 100n,
            destination,
          },
        ],
        senderBalance,
        transactionSigner,
      }

      // ACT
      const result = await createAndSendSolTransaction(client, input)

      // ASSERT
      const res = await getBalance(client, { address: destination }).then((res) => res.value)
      expect(res).toBe(input.recipients[0]?.amount)
      expect(isSignature(result)).toBeTruthy()
    })

    it('should create and send sol to multiple recipients', async () => {
      // ARRANGE
      expect.assertions(3)
      const destinationAliceKeypair = await generateKeyPairSigner()
      const destinationAlice = destinationAliceKeypair.address
      const destinationBobKeypair = await generateKeyPairSigner()
      const destinationBob = destinationBobKeypair.address
      const senderBalance = await getBalance(client, { address: transactionSigner.address }).then((res) => res.value)
      const input: CreateAndSendSolTransactionOptions = {
        latestBlockhash,
        recipients: [
          {
            amount: 100n,
            destination: destinationAlice,
          },
          {
            amount: 42n,
            destination: destinationBob,
          },
        ],
        senderBalance,
        transactionSigner,
      }

      // ACT
      const result = await createAndSendSolTransaction(client, input)

      // ASSERT
      const balanceAlice = await getBalance(client, { address: destinationAlice }).then((res) => res.value)
      const balanceBob = await getBalance(client, { address: destinationBob }).then((res) => res.value)
      expect(balanceAlice).toBe(input.recipients[0]?.amount)
      expect(balanceBob).toBe(input.recipients[1]?.amount)
      expect(isSignature(result)).toBeTruthy()
    })
  })
})
