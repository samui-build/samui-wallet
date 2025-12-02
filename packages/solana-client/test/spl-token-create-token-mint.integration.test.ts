import { generateKeyPairSigner, isAddress } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { TOKEN_2022_PROGRAM_ADDRESS } from '../src/constants.ts'
import { getTokenAccountsForMint } from '../src/get-token-accounts-for-mint.ts'
import { splTokenCreateTokenMint } from '../src/spl-token-create-token-mint.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'
import { setupIntegrationTestContext } from './test-helpers.ts'

describe('spl-token-create-token-mint', async () => {
  const { client, latestBlockhash, feePayer } = await setupIntegrationTestContext()

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
      expect(isAddress(result.mint)).toBeTruthy()
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
      expect(isAddress(result.mint)).toBeTruthy()
    })

    it('should create a token 2022 mint without extensions', async () => {
      // ARRANGE
      expect.assertions(2)
      const mint = await generateKeyPairSigner()
      const decimals = 9

      // ACT
      const result = await splTokenCreateTokenMint(client, {
        decimals,
        feePayer,
        latestBlockhash,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      })

      // ASSERT
      expect(isAddress(result.mint)).toBeTruthy()
      expect(result.mint).toBe(mint.address)
    })

    it('should create a token 2022 mint with close mint extension', async () => {
      // ARRANGE
      expect.assertions(3)
      const mint = await generateKeyPairSigner()
      const decimals = 9
      const closeAuthority = await generateKeyPairSigner()

      // ACT
      const result = await splTokenCreateTokenMint(client, {
        decimals,
        extensions: {
          closeMint: {
            address: closeAuthority.address,
          },
          permanentDelegate: undefined,
        },
        feePayer,
        latestBlockhash,
        mint,
      })

      // ASSERT
      expect(isAddress(result.mint)).toBeTruthy()
      expect(result.mint).toBe(mint.address)
      expect(result.signatureCreate).toBeDefined()
    })

    it('should create a token 2022 mint with permanent delegate extension', async () => {
      // ARRANGE
      expect.assertions(3)
      const mint = await generateKeyPairSigner()
      const decimals = 6
      const permanentDelegate = await generateKeyPairSigner()

      // ACT
      const result = await splTokenCreateTokenMint(client, {
        decimals,
        extensions: {
          closeMint: undefined,
          permanentDelegate: {
            address: permanentDelegate.address,
          },
        },
        feePayer,
        latestBlockhash,
        mint,

        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      })

      // ASSERT
      expect(isAddress(result.mint)).toBeTruthy()
      expect(result.mint).toBe(mint.address)
      expect(result.signatureCreate).toBeDefined()
    })

    it('should create a token 2022 mint with both close mint and permanent delegate extensions', async () => {
      // ARRANGE
      expect.assertions(3)
      const mint = await generateKeyPairSigner()
      const decimals = 9
      const closeAuthority = await generateKeyPairSigner()
      const permanentDelegate = await generateKeyPairSigner()

      // ACT
      const result = await splTokenCreateTokenMint(client, {
        decimals,
        extensions: {
          closeMint: {
            address: closeAuthority.address,
          },
          permanentDelegate: {
            address: permanentDelegate.address,
          },
        },
        feePayer,
        latestBlockhash,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      })

      // ASSERT
      expect(isAddress(result.mint)).toBeTruthy()
      expect(result.mint).toBe(mint.address)
      expect(result.signatureCreate).toBeDefined()
    })

    it('should create a token 2022 mint with close mint extension and supply', async () => {
      // ARRANGE
      expect.assertions(7)
      const mint = await generateKeyPairSigner()
      const decimals = 9
      const supply = uiAmountToBigInt('500', decimals)
      const closeAuthority = await generateKeyPairSigner()

      // ACT
      const result = await splTokenCreateTokenMint(client, {
        decimals,
        extensions: {
          closeMint: {
            address: closeAuthority.address,
          },
          permanentDelegate: undefined,
        },
        feePayer,
        latestBlockhash,
        mint,
        supply,

        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      })

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
      expect(tokenAccount.account.data.parsed.info.tokenAmount.uiAmountString).toBe('500')
      expect(tokenAccount.account.data.parsed.info.mint).toBe(result.mint)
      expect(tokenAccount.pubkey).toBe(result.ata)
      expect(result.signatureCreate).toBeDefined()
      expect(result.signatureSupply).toBeDefined()
    })

    it('should create a token 2022 mint with both extensions and supply', async () => {
      // ARRANGE
      expect.assertions(7)
      const mint = await generateKeyPairSigner()
      const decimals = 6
      const supply = uiAmountToBigInt('1000', decimals)
      const closeAuthority = await generateKeyPairSigner()
      const permanentDelegate = await generateKeyPairSigner()

      // ACT
      const result = await splTokenCreateTokenMint(client, {
        decimals,
        extensions: {
          closeMint: {
            address: closeAuthority.address,
          },
          permanentDelegate: {
            address: permanentDelegate.address,
          },
        },
        feePayer,
        latestBlockhash,
        mint,
        supply,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      })

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
      expect(result.signatureCreate).toBeDefined()
      expect(result.signatureSupply).toBeDefined()
    })
  })
})
