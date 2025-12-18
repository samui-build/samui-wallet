import type { KeyPairSigner } from '@solana/kit'
import { isSignature } from '@solana/kit'
import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TOKEN_2022_PROGRAM_ADDRESS } from '../src/constants.ts'
import type { LatestBlockhash } from '../src/get-latest-blockhash.ts'
import type { SolanaClient } from '../src/solana-client.ts'
import { splToken2022CreateTokenMint } from '../src/spl-token-2022-create-token-mint.ts'
import { splTokenBurn } from '../src/spl-token-burn.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'
import { getTokenAccount, setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('spl-token-burn', () => {
  let client: SolanaClient
  let latestBlockhash: LatestBlockhash
  let transactionSigner: KeyPairSigner

  beforeEach(async () => {
    const context = await setupIntegrationTestContext()
    client = context.client
    latestBlockhash = context.latestBlockhash
    transactionSigner = context.transactionSigner
  })

  describe('expected behavior', () => {
    it('should burn token from a mint', async () => {
      // ARRANGE
      expect.assertions(3)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '420', transactionSigner })

      if (!testMint.result.ata) {
        throw new Error('Failed to mint supply')
      }
      const accountBefore = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint.result.mint,
      })

      // ACT
      const result = await splTokenBurn(client, {
        account: testMint.result.ata,
        amount: uiAmountToBigInt('20', testMint.input.decimals),
        latestBlockhash,
        mint: testMint.result.mint,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ASSERT
      const accountAfter = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint.result.mint,
      })

      expect(accountBefore?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('420')
      expect(accountAfter?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('400')
      expect(isSignature(result.signature)).toBeTruthy()
    })

    it('should burn token 2022 from a mint', async () => {
      // ARRANGE
      expect.assertions(3)
      const testMint = await splToken2022CreateTokenMint(client, {
        decimals: 6,
        latestBlockhash,
        supply: uiAmountToBigInt('420', 6),
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        transactionSigner,
      })

      if (!testMint.ata) {
        throw new Error('Failed to mint supply')
      }
      const accountBefore = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint.mint,
      })

      // ACT
      const result = await splTokenBurn(client, {
        account: testMint.ata,
        amount: uiAmountToBigInt('20', 6),
        latestBlockhash,
        mint: testMint.mint,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ASSERT
      const accountAfter = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint.mint,
      })

      expect(accountBefore?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('420')
      expect(accountAfter?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('400')
      expect(isSignature(result.signature)).toBeTruthy()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should reject when burning more tokens than the account balance', async () => {
      // ARRANGE
      expect.assertions(2)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '10', transactionSigner })

      if (!testMint.result.ata) {
        throw new Error('Failed to mint supply')
      }

      // ACT
      const result = splTokenBurn(client, {
        account: testMint.result.ata,
        amount: uiAmountToBigInt('20', testMint.input.decimals),
        latestBlockhash,
        mint: testMint.result.mint,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ASSERT
      await expect(result).rejects.toThrow()

      const accountAfter = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint.result.mint,
      })
      expect(accountAfter?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('10')
    })

    it('should reject when the token account does not match the mint', async () => {
      // ARRANGE
      expect.assertions(2)
      const testMint1 = await setupIntegrationTestMint({ client, latestBlockhash, supply: '10', transactionSigner })
      const testMint2 = await setupIntegrationTestMint({ client, latestBlockhash, supply: '10', transactionSigner })

      if (!testMint1.result.ata) {
        throw new Error('Failed to mint supply')
      }

      // ACT
      const result = splTokenBurn(client, {
        account: testMint1.result.ata,
        amount: uiAmountToBigInt('1', testMint1.input.decimals),
        latestBlockhash,
        mint: testMint2.result.mint,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ASSERT
      await expect(result).rejects.toThrow()

      const accountAfter = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint1.result.mint,
      })
      expect(accountAfter?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('10')
    })

    it('should reject when the token program does not match the token account owner', async () => {
      // ARRANGE
      expect.assertions(2)
      const testMint = await splToken2022CreateTokenMint(client, {
        decimals: 6,
        latestBlockhash,
        supply: uiAmountToBigInt('10', 6),
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        transactionSigner,
      })

      if (!testMint.ata) {
        throw new Error('Failed to mint supply')
      }

      // ACT
      const result = splTokenBurn(client, {
        account: testMint.ata,
        amount: uiAmountToBigInt('1', 6),
        latestBlockhash,
        mint: testMint.mint,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ASSERT
      await expect(result).rejects.toThrow()

      const accountAfter = await getTokenAccount(client, {
        address: transactionSigner.address,
        mint: testMint.mint,
      })
      expect(accountAfter?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('10')
    })

    it('should reject when the burn amount is zero', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = splTokenBurn(client, {
        account: transactionSigner.address,
        amount: 0n,
        latestBlockhash,
        mint: transactionSigner.address,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ASSERT
      await expect(result).rejects.toThrow('Amount must be greater than 0')
    })
  })
})
