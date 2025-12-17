import { generateKeyPairSigner, isSignature } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import {
  type CreateAndSendSplTransactionOptions,
  createAndSendSplTransaction,
} from '../src/create-and-send-spl-transaction.ts'
import { getTokenAccountsForMint } from '../src/get-token-accounts-for-mint.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('create-and-send-spl-transaction', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()

  describe('expected behavior', () => {
    it('should create and send spl token', async () => {
      // ARRANGE
      expect.assertions(2)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '1000', transactionSigner })
      const destinationKeypair = await generateKeyPairSigner()
      const destination = destinationKeypair.address
      const amount = '420'
      const input: CreateAndSendSplTransactionOptions = {
        latestBlockhash,
        mint: testMint.result.mint,
        recipients: [{ amount: uiAmountToBigInt(amount, testMint.input.decimals), destination }],
        transactionSigner,
      }

      // ACT
      const result = await createAndSendSplTransaction(client, input)

      // ASSERT
      const [tokenAccount] = await getTokenAccountsForMint(client, {
        address: destination,
        mint: testMint.result.mint,
      }).then((res) => res.value)

      expect(tokenAccount?.account.data.parsed.info.tokenAmount.uiAmountString).toBe(amount)
      expect(isSignature(result)).toBeTruthy()
    })

    it('should create and send spl tokens to multiple destinations', async () => {
      // ARRANGE
      expect.assertions(4)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '1000', transactionSigner })
      const destinationAliceKeypair = await generateKeyPairSigner()
      const destinationAlice = destinationAliceKeypair.address
      const destinationBobKeypair = await generateKeyPairSigner()
      const destinationBob = destinationBobKeypair.address
      const amountAlice = '420'
      const amountBob = '42'
      const input: CreateAndSendSplTransactionOptions = {
        latestBlockhash,
        mint: testMint.result.mint,
        recipients: [
          { amount: uiAmountToBigInt(amountAlice, testMint.input.decimals), destination: destinationAlice },
          { amount: uiAmountToBigInt(amountBob, testMint.input.decimals), destination: destinationBob },
        ],
        transactionSigner,
      }

      // ACT
      const result = await createAndSendSplTransaction(client, input)

      // ASSERT
      const [tokenAccountAlice] = await getTokenAccountsForMint(client, {
        address: destinationAlice,
        mint: testMint.result.mint,
      }).then((res) => res.value)
      const [tokenAccountBob] = await getTokenAccountsForMint(client, {
        address: destinationBob,
        mint: testMint.result.mint,
      }).then((res) => res.value)
      const [tokenAccountTransactionSigner] = await getTokenAccountsForMint(client, {
        address: transactionSigner.address,
        mint: testMint.result.mint,
      }).then((res) => res.value)

      expect(tokenAccountAlice?.account.data.parsed.info.tokenAmount.uiAmountString).toBe(amountAlice)
      expect(tokenAccountBob?.account.data.parsed.info.tokenAmount.uiAmountString).toBe(amountBob)
      expect(tokenAccountTransactionSigner?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('538')
      expect(isSignature(result)).toBeTruthy()
    })
  })
})
