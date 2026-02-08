import { type Address, generateKeyPairSigner } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { BPF_LOADER, SYSTEM_ACCOUNT, TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '../src/constants.ts'
import { fetchAccount } from '../src/fetch-account.ts'
import { type AccountType, getAccountType } from '../src/get-account-type.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('get-account-type', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()
  const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '1000', transactionSigner })
  const randomKeyPairSigner = await generateKeyPairSigner()
  describe('expected behavior', () => {
    it.each<{ address: Address; type: AccountType }>([
      { address: BPF_LOADER, type: 'system' },
      { address: SYSTEM_ACCOUNT, type: 'system' },
      { address: transactionSigner.address, type: 'system' },
      { address: TOKEN_2022_PROGRAM_ADDRESS, type: 'system-program' },
      { address: TOKEN_PROGRAM_ADDRESS, type: 'system-program' },
      { address: testMint.result.mint, type: 'token-mint' },
      { address: testMint.result.ata as Address, type: 'token-account' },
      { address: randomKeyPairSigner.address, type: 'not-found' },
    ])('should get account type %o', async ({ address, type }) => {
      // ARRANGE
      expect.assertions(1)
      const account = await fetchAccount(client, { address, throwOnError: false })

      // ACT
      const result = getAccountType(account)

      // ASSERT
      expect(result).toBe(type)
    })
  })
})
