import { generateKeyPairSigner, isSignature } from '@solana/kit'
import { beforeAll, describe, expect, it } from 'vitest'
import {
  type CreateAndSendTransactionSolOptions,
  createAndSendTransactionSol,
} from '../src/create-and-send-transaction-sol.ts'
import { getActivity } from '../src/get-activity.ts'
import { getBalance } from '../src/get-balance.ts'
import { getTransaction } from '../src/get-transaction.ts'
import { getTransactionBase64 } from '../src/get-transaction-base64.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'
import { type IntegrationTestContext, setupIntegrationTestContext } from './test-helpers.ts'

describe('get-transaction', () => {
  let context: IntegrationTestContext

  beforeAll(async () => {
    context = await setupIntegrationTestContext()
  })

  describe('expected behavior', () => {
    it('should get parsed transaction, base64 transaction and account activity for a confirmed transaction', async () => {
      // ARRANGE
      expect.assertions(6)
      const { client, latestBlockhash, transactionSigner } = context
      const destination = (await generateKeyPairSigner()).address
      const senderBalance = await getBalance(client, { address: transactionSigner.address }).then((res) => res.value)
      const input: CreateAndSendTransactionSolOptions = {
        latestBlockhash,
        recipients: [{ amount: solToLamports('0.01'), destination }],
        senderBalance,
        transactionSigner,
      }

      // ACT
      const signature = await createAndSendTransactionSol(client, input)
      const result = await getTransaction(client, { signature })
      const resultBase64 = await getTransactionBase64(client, { signature })
      const activity = await getActivity(client, { address: transactionSigner.address })

      // ASSERT
      expect(isSignature(signature)).toBeTruthy()
      expect(result?.transaction.signatures).toContain(signature)
      expect(resultBase64).toEqual(expect.any(String))
      expect(resultBase64?.length).toBeGreaterThan(0)
      expect(activity.some((item) => item.signature === signature)).toBeTruthy()
      expect(activity.every((item) => isSignature(item.signature))).toBeTruthy()
    })
  })
})
