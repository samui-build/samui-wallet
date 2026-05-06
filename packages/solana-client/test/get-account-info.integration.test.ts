import { beforeAll, describe, expect, it } from 'vitest'
import { getAccountInfo } from '../src/get-account-info.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'
import { type IntegrationTestContext, setupIntegrationTestContext } from './test-helpers.ts'

describe('get-account-info', () => {
  let context: IntegrationTestContext

  beforeAll(async () => {
    context = await setupIntegrationTestContext()
  })

  describe('expected behavior', () => {
    it('should get account info for a funded system account', async () => {
      // ARRANGE
      expect.assertions(3)
      const { client, transactionSigner } = context

      // ACT
      const result = await getAccountInfo(client, { address: transactionSigner.address })
      const data = Array.isArray(result.value?.data) ? result.value.data[0] : result.value?.data

      // ASSERT
      expect(data).toBe('')
      expect(result.value?.lamports).toBe(solToLamports('1'))
      expect(result.value?.owner).toBe('11111111111111111111111111111111')
    })
  })
})
