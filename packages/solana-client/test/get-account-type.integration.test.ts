import type { Address } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import {
  BPF_LOADER,
  NATIVE_MINT,
  SYSTEM_ACCOUNT,
  TOKEN_2022_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
} from '../src/constants.ts'
import { getAccountInfo } from '../src/get-account-info.ts'
import { type AccountType, getAccountType } from '../src/get-account-type.ts'
import { setupIntegrationTestContext, setupIntegrationTestMint } from './test-helpers.ts'

describe('get-account-info', async () => {
  const { client, latestBlockhash, transactionSigner } = await setupIntegrationTestContext()
  const testMint = await setupIntegrationTestMint({ client, latestBlockhash, supply: '1000', transactionSigner })

  describe('expected behavior', () => {
    it.each<{ address: Address; type: AccountType }>([
      { address: BPF_LOADER, type: 'system' },
      { address: SYSTEM_ACCOUNT, type: 'system' },
      { address: transactionSigner.address, type: 'system' },
      { address: TOKEN_2022_PROGRAM_ADDRESS, type: 'system-program' },
      { address: TOKEN_PROGRAM_ADDRESS, type: 'system-program' },
      { address: NATIVE_MINT, type: 'token-mint' },
      { address: testMint.result.mint, type: 'token-mint' },
      { address: testMint.result.ata as Address, type: 'token-account' },
    ])('should get account type %o', async ({ address, type }) => {
      // ARRANGE
      expect.assertions(1)
      const account = await getAccountInfo(client, { address })

      // ACT
      const result = getAccountType({ account })

      // ASSERT
      expect(result).toBe(type)
    })
  })
})
