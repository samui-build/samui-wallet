import { generateKeyPairSigner, isSignature } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import {
  type CreateAndSendSplTransactionOptions,
  createAndSendSplTransaction,
} from '../src/create-and-send-spl-transaction.ts'
import { getTokenAccountsForMint } from '../src/get-token-accounts-for-mint.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('create-and-send-spl-transaction', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()
  const testMint = await setupIntegrationTestMint({ client, latestBlockhash, transactionSigner })

  describe('expected behavior', () => {
    it('should create and send spl token', async () => {
      // ARRANGE
      expect.assertions(2)
      const destinationKeypair = await generateKeyPairSigner()
      const destination = destinationKeypair.address
      const input: CreateAndSendSplTransactionOptions = {
        amount: '420',
        decimals: testMint.input.decimals,
        destination,
        latestBlockhash,
        mint: testMint.result.mint,
        transactionSigner,
      }

      // ACT
      const result = await createAndSendSplTransaction(client, input)

      // ASSERT
      const [tokenAccount] = await getTokenAccountsForMint(client, {
        address: destination,
        mint: testMint.result.mint,
      }).then((res) => res.value)

      expect(tokenAccount?.account.data.parsed.info.tokenAmount.uiAmountString).toBe(input.amount)
      expect(isSignature(result)).toBeTruthy()
    })
  })
})
