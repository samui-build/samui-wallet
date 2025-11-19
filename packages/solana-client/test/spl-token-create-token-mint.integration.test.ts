import { generateKeyPairSigner, type KeyPairSigner } from '@solana/kit'
import { beforeAll, describe, expect, it } from 'vitest'
import { createSolanaClient } from '../src/create-solana-client.ts'
import { getLatestBlockhash, type LatestBlockhash } from '../src/get-latest-blockhash.ts'
import { getTokenAccountsForMint } from '../src/get-token-accounts-for-mint.ts'
import { isValidAddress } from '../src/is-valid-address.ts'
import { requestAirdrop } from '../src/request-airdrop.ts'
import { splTokenCreateTokenMint } from '../src/spl-token-create-token-mint.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'

describe('spl-token-create-token-mint', () => {
  const client = createSolanaClient({
    url: 'http://localhost:8899',
    urlSubscriptions: 'ws://localhost:8900',
  })
  let latestBlockhash: LatestBlockhash
  let feePayer: KeyPairSigner
  beforeAll(async () => {
    feePayer = await generateKeyPairSigner()
    latestBlockhash = await getLatestBlockhash(client)
    await requestAirdrop({ address: feePayer.address, amount: 1, client })
  })

  describe('expected behavior', () => {
    it('should create a token mint with mint and no supply', async () => {
      // ARRANGE
      expect.assertions(2)
      const mint = await generateKeyPairSigner()

      // ACT
      const result = await splTokenCreateTokenMint(client, { decimals: 0, feePayer, latestBlockhash, mint })

      // ASSERT
      const res = await getTokenAccountsForMint(client, { address: feePayer.address, mint: mint.address }).then(
        (res) => res.value,
      )
      expect(res.length).toBe(0)
      expect(result.mint).toBe(mint.address)
    })

    it('should create a token mint with mint and supply', async () => {
      // ARRANGE
      expect.assertions(6)
      const mint = await generateKeyPairSigner()
      const decimals = 9
      const supply = uiAmountToBigInt('1000', decimals)

      // ACT
      const result = await splTokenCreateTokenMint(client, { decimals, feePayer, latestBlockhash, mint, supply })

      // ASSERT

      const [tokenAccount] = await getTokenAccountsForMint(client, {
        address: feePayer.address,
        mint: mint.address,
      }).then((res) => res.value)
      if (!tokenAccount) {
        throw new Error(`Token account not found`)
      }

      expect(tokenAccount.account.data.parsed.info.tokenAmount.amount).toBe('1000000000000')
      expect(tokenAccount.account.data.parsed.info.tokenAmount.decimals).toBe(decimals)
      expect(tokenAccount.account.data.parsed.info.tokenAmount.uiAmountString).toBe('1000')
      expect(tokenAccount.account.data.parsed.info.mint).toBe(mint.address)
      expect(tokenAccount.pubkey).toBe(result.ata)
      expect(result.mint).toBe(mint.address)
    })

    it('should create a token mint with generated mint and no supply', async () => {
      // ARRANGE
      expect.assertions(1)
      const decimals = 9

      // ACT
      const result = await splTokenCreateTokenMint(client, { decimals, feePayer, latestBlockhash })

      // ASSERT
      expect(isValidAddress(result.mint)).toBeTruthy()
    })

    it('should create a token mint with generated mint and supply', async () => {
      // ARRANGE
      expect.assertions(6)
      const decimals = 9
      const supply = uiAmountToBigInt('1000', 9)

      // ACT
      const result = await splTokenCreateTokenMint(client, { decimals, feePayer, latestBlockhash, supply })

      // ASSERT
      const [tokenAccount] = await getTokenAccountsForMint(client, {
        address: feePayer.address,
        mint: result.mint,
      }).then((res) => res.value)
      if (!tokenAccount) {
        throw new Error(`Token account not found`)
      }

      expect(tokenAccount.account.data.parsed.info.tokenAmount.amount).toBe(supply.toString())
      expect(tokenAccount.account.data.parsed.info.tokenAmount.decimals).toBe(decimals)
      expect(tokenAccount.account.data.parsed.info.tokenAmount.uiAmountString).toBe('1000')
      expect(tokenAccount.account.data.parsed.info.mint).toBe(result.mint)
      expect(tokenAccount.pubkey).toBe(result.ata)
      expect(isValidAddress(result.mint)).toBeTruthy()
    })
  })
})
