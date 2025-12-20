import { type Address, assertAccountExists } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { fetchAccount } from '../src/fetch-account.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('fetch-account', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()
  describe('expected behavior', () => {
    it('should get account info for transaction signer', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = await fetchAccount(client, { address: transactionSigner.address })

      // ASSERT
      assertAccountExists(result)
      expect(result.lamports).toBe(solToLamports('1'))
      expect(result.programAddress).toBe('11111111111111111111111111111111')
    })

    it('should get account info for ata and mint', async () => {
      // ARRANGE
      expect.assertions(4)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '100', transactionSigner })

      // ACT
      const resultAta = await fetchAccount(client, { address: testMint.result.ata as Address })
      const resultMint = await fetchAccount(client, { address: testMint.result.mint })

      // ASSERT
      assertAccountExists(resultAta)
      assertAccountExists(resultMint)
      expect(resultAta?.data.parsedAccountMeta?.program).toBe('spl-token')
      expect(resultAta?.data.parsedAccountMeta?.type).toBe('account')
      expect(resultMint.data.parsedAccountMeta?.program).toBe('spl-token')
      expect(resultMint.data.parsedAccountMeta?.type).toBe('mint')
    })
  })
})
