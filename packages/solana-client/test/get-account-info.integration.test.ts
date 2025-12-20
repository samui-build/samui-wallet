import type { Address } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { getAccountInfo } from '../src/get-account-info.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('get-account-info', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()
  describe('expected behavior', () => {
    it('should get account info for transaction signer', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = await getAccountInfo(client, { address: transactionSigner.address })

      // ASSERT
      expect(result.lamports).toBe(solToLamports('1'))
      expect(result.owner).toBe('11111111111111111111111111111111')
    })

    it('should get account info for ata and mint', async () => {
      // ARRANGE
      expect.assertions(4)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '100', transactionSigner })

      // ACT
      const resultAta = await getAccountInfo(client, { address: testMint.result.ata as Address })
      const resultMint = await getAccountInfo(client, { address: testMint.result.mint })

      // ASSERT
      expect(resultAta.data.program).toBe('spl-token')
      expect(resultAta.data.parsed.type).toBe('account')
      expect(resultMint.data.program).toBe('spl-token')
      expect(resultMint.data.parsed.type).toBe('mint')
    })
  })
})
