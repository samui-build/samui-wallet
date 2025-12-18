import { isSignature } from '@solana/kit'
import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { describe, expect, it } from 'vitest'
import { splTokenBurn } from '../src/spl-token-burn.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'
import { getTokenAccount, setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('spl-token-burn', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()

  describe('expected behavior', () => {
    it('should burn token from a mint', async () => {
      // ARRANGE
      expect.assertions(3)
      const testMint = await setupIntegrationTestMint({ client, latestBlockhash, transactionSigner })

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
  })
})
