import { beforeAll, describe, expect, it } from 'vitest'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '../src/constants.ts'
import { getTokenAccounts } from '../src/get-token-accounts.ts'
import { splToken2022CreateTokenMint } from '../src/spl-token-2022-create-token-mint.ts'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'
import { type IntegrationTestContext, setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('get-token-accounts', () => {
  let context: IntegrationTestContext

  beforeAll(async () => {
    context = await setupIntegrationTestContext()
  })

  describe('expected behavior', () => {
    it('should get spl token and token 2022 accounts for an owner', async () => {
      // ARRANGE
      expect.assertions(4)
      const { client, latestBlockhash, transactionSigner } = context
      const tokenMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '100', transactionSigner })
      const token2022Mint = await splToken2022CreateTokenMint(client, {
        decimals: 6,
        latestBlockhash,
        supply: uiAmountToBigInt('100', 6),
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        transactionSigner,
      })

      // ACT
      const result = await getTokenAccounts(client, { address: transactionSigner.address })

      // ASSERT
      const tokenAccount = result.find((account) => account.account.data.parsed.info.mint === tokenMint.result.mint)
      const token2022Account = result.find((account) => account.account.data.parsed.info.mint === token2022Mint.mint)
      expect(tokenAccount?.account.owner).toBe(TOKEN_PROGRAM_ADDRESS)
      expect(tokenAccount?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('100')
      expect(token2022Account?.account.owner).toBe(TOKEN_2022_PROGRAM_ADDRESS)
      expect(token2022Account?.account.data.parsed.info.tokenAmount.uiAmountString).toBe('100')
    })
  })
})
