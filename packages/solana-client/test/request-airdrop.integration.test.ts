import { generateKeyPair, getAddressFromPublicKey } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { createSolanaClient } from '../src/create-solana-client.ts'
import { getBalance } from '../src/get-balance.ts'
import { requestAirdrop } from '../src/request-airdrop.ts'
import { solToLamports } from '../src/sol-to-lamports.ts'

describe('request-airdrop', () => {
  describe('expected behavior', () => {
    it('should get balance, request airdrop and get balance', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const keypair = await generateKeyPair()
      const address = await getAddressFromPublicKey(keypair.publicKey)
      const client = createSolanaClient({ url: 'http://localhost:8899', urlSubscriptions: 'ws://localhost:8900' })
      const initialBalance = await getBalance(client, { address })
      await requestAirdrop(client, {
        address,
        amount: solToLamports('1'),
      })
      const finalBalance = await getBalance(client, { address })

      // ASSERT
      expect(initialBalance.value).toBe(0n)
      expect(finalBalance.value).toBe(1_000_000_000n)
    })
  })
})
