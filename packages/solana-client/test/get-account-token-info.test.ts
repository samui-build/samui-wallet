import {
  address,
  type JsonParsedTokenAccount,
  type JsonParsedTokenProgramAccount,
  lamports,
  type TokenAmount,
} from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '../src/constants.ts'
import type { FetchedAccount } from '../src/fetch-account.ts'
import { getAccountTokenInfo } from '../src/get-account-token-info.ts'

function createTokenAmount(): TokenAmount {
  return {
    amount: '4200000' as TokenAmount['amount'],
    decimals: 6,
    uiAmount: 4.2,
    uiAmountString: '4.2' as TokenAmount['uiAmountString'],
  }
}

function createTokenAccount(): FetchedAccount {
  const tokenAmount = createTokenAmount()
  const data: JsonParsedTokenAccount & {
    parsedAccountMeta: {
      program: 'spl-token'
      type: 'account'
    }
  } = {
    closeAuthority: address('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
    delegate: address('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    delegatedAmount: tokenAmount,
    extensions: [{ extension: 'memoTransfer' }, { extension: 'immutableOwner' }, { extension: 123 }],
    isNative: false,
    mint: address('So11111111111111111111111111111111111111112'),
    owner: address('11111111111111111111111111111111'),
    parsedAccountMeta: {
      program: 'spl-token',
      type: 'account',
    },
    rentExemptReserve: tokenAmount,
    state: 'initialized',
    tokenAmount,
  }

  return {
    address: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
    data,
    executable: false,
    exists: true,
    lamports: lamports(1n),
    programAddress: TOKEN_PROGRAM_ADDRESS,
    space: 165n,
  }
}

function createTokenMint(): FetchedAccount {
  const data: Extract<JsonParsedTokenProgramAccount, { type: 'mint' }>['info'] & {
    parsedAccountMeta: {
      program: 'spl-token-2022'
      type: 'mint'
    }
  } = {
    decimals: 6,
    extensions: [{ extension: 'groupPointer' }],
    freezeAuthority: address('11111111111111111111111111111111'),
    isInitialized: true,
    mintAuthority: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
    parsedAccountMeta: {
      program: 'spl-token-2022',
      type: 'mint',
    },
    supply: '1000000' as TokenAmount['amount'],
  }

  return {
    address: address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    data,
    executable: false,
    exists: true,
    lamports: lamports(1n),
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
    space: 82n,
  }
}

describe('get-account-token-info', () => {
  describe('expected behavior', () => {
    it('should return token account details for parsed token accounts', () => {
      // ARRANGE
      expect.assertions(1)
      const account = createTokenAccount()

      // ACT
      const result = getAccountTokenInfo({ account })

      // ASSERT
      expect(result).toStrictEqual({
        extensions: 'immutableOwner, memoTransfer',
        mint: address('So11111111111111111111111111111111111111112'),
        mintAmount: 4.2,
        mintDecimals: 6,
        type: 'token-account',
      })
    })

    it('should return token mint details for parsed token mints', () => {
      // ARRANGE
      expect.assertions(1)
      const account = createTokenMint()

      // ACT
      const result = getAccountTokenInfo({ account })

      // ASSERT
      expect(result).toStrictEqual({
        freezeAuthority: address('11111111111111111111111111111111'),
        mintAuthority: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
        mintDecimals: 6,
        mintSupply: '1000000',
        type: 'token-mint',
      })
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return undefined for accounts that do not exist', () => {
      // ARRANGE
      expect.assertions(1)
      const account: FetchedAccount = {
        address: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
        exists: false,
      }

      // ACT
      const result = getAccountTokenInfo({ account })

      // ASSERT
      expect(result).toBeUndefined()
    })

    it('should return undefined for token accounts with unsupported parsed types', () => {
      // ARRANGE
      expect.assertions(1)
      const data: Extract<JsonParsedTokenProgramAccount, { type: 'multisig' }>['info'] & {
        parsedAccountMeta: {
          program: 'spl-token'
          type: 'multisig'
        }
      } = {
        isInitialized: true,
        numRequiredSigners: 2,
        numValidSigners: 2,
        parsedAccountMeta: {
          program: 'spl-token',
          type: 'multisig',
        },
        signers: [address('11111111111111111111111111111111')],
      }
      const account: FetchedAccount = {
        address: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
        data,
        executable: false,
        exists: true,
        lamports: lamports(1n),
        programAddress: TOKEN_PROGRAM_ADDRESS,
        space: 355n,
      }

      // ACT
      const result = getAccountTokenInfo({ account })

      // ASSERT
      expect(result).toBeUndefined()
    })
  })
})
