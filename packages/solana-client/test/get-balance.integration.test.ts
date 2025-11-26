import { generateKeyPair, getAddressFromPublicKey } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { getBalance } from '../src/get-balance.ts'
import { setupIntegrationTestContext } from './test-helpers.ts'

describe('get-balance', async () => {
  const { client } = await setupIntegrationTestContext()

  describe('expected behavior', () => {
    it('should get balance for an empty account', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const keypair = await generateKeyPair()
      const address = await getAddressFromPublicKey(keypair.publicKey)
      const balance = await getBalance(client, { address })

      // ASSERT
      expect(balance.value).toBe(0n)
    })
  })
})
