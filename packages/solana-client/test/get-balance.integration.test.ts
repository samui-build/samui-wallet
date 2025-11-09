import { generateKeyPair, getAddressFromPublicKey } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { createSolanaClient } from '../src/create-solana-client.ts'
import { getBalance } from '../src/get-balance.ts'

describe('get-balance', () => {
  describe('expected behavior', () => {
    it('should get balance for an empty account', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const keypair = await generateKeyPair()
      const address = await getAddressFromPublicKey(keypair.publicKey)
      const client = createSolanaClient({ url: 'http://localhost:8899' })
      const balance = await getBalance(client, { address })

      // ASSERT
      expect(balance.value).toBe(0n)
    })
  })
})
