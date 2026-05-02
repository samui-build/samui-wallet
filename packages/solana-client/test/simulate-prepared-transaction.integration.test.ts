import { generateKeyPairSigner } from '@solana/kit'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type CreateAndSendTransactionSplOptions,
  createAndSendTransactionSpl,
} from '../src/create-and-send-transaction-spl.ts'
import { createTransferInstructionsSol } from '../src/create-transfer-instructions-sol.ts'
import { getBalance } from '../src/get-balance.ts'
import { prepareTransactionSol } from '../src/prepare-transaction-sol.ts'
import { prepareTransactionSpl } from '../src/prepare-transaction-spl.ts'
import { simulatePreparedTransaction } from '../src/simulate-prepared-transaction.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'
import type { SolanaClient } from '../src/solana-client.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('simulate-prepared-transaction', () => {
  let context: Awaited<ReturnType<typeof setupIntegrationTestContext>>

  beforeAll(async () => {
    context = await setupIntegrationTestContext()
  })

  describe('expected behavior', () => {
    it('should show sol balance deltas and fee impact for a valid sol transfer', async () => {
      // ARRANGE
      expect.assertions(5)
      const { client, latestBlockhash, transactionSigner } = context
      const destination = (await generateKeyPairSigner()).address
      const amount = 100n
      const senderBalance = await getBalance(client, { address: transactionSigner.address }).then((res) => res.value)
      const preparedTransaction = prepareTransactionSol({
        recipients: [{ amount, destination }],
        senderBalance,
        transactionSigner,
      })

      // ACT
      const result = await simulatePreparedTransaction(client, { ...preparedTransaction, latestBlockhash })

      // ASSERT
      expect(result.status).toBe('success')
      if (result.status !== 'success') {
        throw new Error('Simulation should succeed')
      }
      const destinationChange = result.solBalanceChanges.find((row) => row.address === destination)
      const signerChange = result.solBalanceChanges.find((row) => row.address === transactionSigner.address)
      expect(result.error).toBeNull()
      expect(result.fee).toBeGreaterThan(0n)
      expect(destinationChange?.change).toBe(amount)
      expect(signerChange?.change).toBe(-(amount + (result.fee ?? 0n)))
    })

    it('should show token balance deltas for a valid spl transfer to an existing token account', async () => {
      // ARRANGE
      expect.assertions(5)
      const { client, latestBlockhash, transactionSigner } = context
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '1000', transactionSigner })
      const destination = (await generateKeyPairSigner()).address
      const initialAmount = uiAmountToBigInt('1', testMint.input.decimals)
      const amount = uiAmountToBigInt('42', testMint.input.decimals)
      const transferInput: CreateAndSendTransactionSplOptions = {
        latestBlockhash,
        mint: testMint.result.mint,
        recipients: [{ amount: initialAmount, destination }],
        transactionSigner,
      }
      await createAndSendTransactionSpl(client, transferInput)
      const preparedTransaction = await prepareTransactionSpl(client, {
        mint: testMint.result.mint,
        recipients: [{ amount, destination }],
        transactionSigner,
      })

      // ACT
      const result = await simulatePreparedTransaction(client, { ...preparedTransaction, latestBlockhash })

      // ASSERT
      expect(result.status).toBe('success')
      if (result.status !== 'success') {
        throw new Error('Simulation should succeed')
      }
      const mintChanges = result.tokenBalanceChanges.filter((row) => row.mint === testMint.result.mint)
      const destinationChange = mintChanges.find((row) => row.change > 0n)
      const sourceChange = mintChanges.find((row) => row.change < 0n)
      expect(result.error).toBeNull()
      expect(mintChanges.length).toBeGreaterThanOrEqual(2)
      expect(destinationChange?.change).toBe(amount)
      expect(sourceChange?.change).toBe(-amount)
    })

    it('should show token and rent deltas for a valid spl transfer with ata creation', async () => {
      // ARRANGE
      expect.assertions(6)
      const { client, latestBlockhash, transactionSigner } = context
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '1000', transactionSigner })
      const destination = (await generateKeyPairSigner()).address
      const amount = uiAmountToBigInt('42', testMint.input.decimals)
      const preparedTransaction = await prepareTransactionSpl(client, {
        mint: testMint.result.mint,
        recipients: [{ amount, destination }],
        transactionSigner,
      })

      // ACT
      const result = await simulatePreparedTransaction(client, { ...preparedTransaction, latestBlockhash })

      // ASSERT
      expect(result.status).toBe('success')
      if (result.status !== 'success') {
        throw new Error('Simulation should succeed')
      }
      const destinationTokenChange = result.tokenBalanceChanges.find((row) => row.change > 0n)
      const rentChange = result.solBalanceChanges.find((row) => row.change > 0n)
      const signerChange = result.solBalanceChanges.find((row) => row.address === transactionSigner.address)
      expect(result.error).toBeNull()
      expect(result.fee).toBeGreaterThan(0n)
      expect(destinationTokenChange?.change).toBe(amount)
      expect(rentChange?.change).toBeGreaterThan(0n)
      expect(signerChange?.change).toBeLessThan(-(result.fee ?? 0n))
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return failure details for an impossible sol transfer', async () => {
      // ARRANGE
      expect.assertions(4)
      const { client, latestBlockhash, transactionSigner } = context
      const destination = (await generateKeyPairSigner()).address
      const input = {
        instructions: createTransferInstructionsSol({
          recipients: [{ amount: solToLamports('2'), destination }],
          source: transactionSigner,
        }),
        latestBlockhash,
        transactionSigner,
      }

      // ACT
      const result = await simulatePreparedTransaction(client as SolanaClient, input)

      // ASSERT
      expect(result.status).toBe('failure')
      if (result.status !== 'failure') {
        throw new Error('Simulation should fail')
      }
      expect(result.error).toBeTruthy()
      expect(result.latestBlockhash).toBe(latestBlockhash)
      expect(result.logs).toBeInstanceOf(Array)
    })
  })
})
