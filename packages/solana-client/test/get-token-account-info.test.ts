import { address, lamports, type TokenAmount } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '../src/constants.ts'
import {
  getTokenAccountProgramAddress,
  isParsedTokenAccountData,
  type TokenAccountInfo,
} from '../src/get-token-account-info.ts'

function createParsedTokenAccountData(): unknown {
  return {
    mint: address('So11111111111111111111111111111111111111112'),
    parsedAccountMeta: {
      program: 'spl-token',
      type: 'account',
    },
    tokenAmount: {
      amount: '1000000' as TokenAmount['amount'],
      decimals: 6,
      uiAmount: 1,
      uiAmountString: '1' as TokenAmount['uiAmountString'],
    },
  }
}

function createTokenAccountInfo(program: 'spl-token' | 'spl-token-2022' | 'system'): TokenAccountInfo {
  return {
    address: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
    data: {
      parsedAccountMeta: {
        program,
        type: 'account',
      },
    },
    executable: false,
    exists: true,
    lamports: lamports(1n),
    programAddress: program === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ADDRESS : TOKEN_PROGRAM_ADDRESS,
    space: 165n,
  } as TokenAccountInfo
}

describe('get-token-account-info', () => {
  describe('expected behavior', () => {
    it('should derive the spl token program address from parsed account metadata', () => {
      // ARRANGE
      expect.assertions(1)
      const account = createTokenAccountInfo('spl-token')

      // ACT
      const result = getTokenAccountProgramAddress({ account })

      // ASSERT
      expect(result).toBe(TOKEN_PROGRAM_ADDRESS)
    })

    it('should derive the token 2022 program address from parsed account metadata', () => {
      // ARRANGE
      expect.assertions(1)
      const account = createTokenAccountInfo('spl-token-2022')

      // ACT
      const result = getTokenAccountProgramAddress({ account })

      // ASSERT
      expect(result).toBe(TOKEN_2022_PROGRAM_ADDRESS)
    })

    it('should identify parsed token account data', () => {
      // ARRANGE
      expect.assertions(1)
      const data = createParsedTokenAccountData()

      // ACT
      if (!isParsedTokenAccountData(data)) {
        throw new Error('Expected parsed token account data')
      }

      // ASSERT
      expect(data.mint).toBe(address('So11111111111111111111111111111111111111112'))
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
      const account = {
        address: address('FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa'),
        exists: false,
      } as unknown as TokenAccountInfo

      // ACT
      const result = getTokenAccountProgramAddress({ account })

      // ASSERT
      expect(result).toBeUndefined()
    })

    it('should reject parsed account data without token amount data', () => {
      // ARRANGE
      expect.assertions(1)
      const data = {
        mint: address('So11111111111111111111111111111111111111112'),
        parsedAccountMeta: {
          program: 'spl-token',
          type: 'account',
        },
      }

      // ACT
      const result = isParsedTokenAccountData(data)

      // ASSERT
      expect(result).toBe(false)
    })

    it('should reject raw account data', () => {
      // ARRANGE
      expect.assertions(1)
      const data = new Uint8Array()

      // ACT
      const result = isParsedTokenAccountData(data)

      // ASSERT
      expect(result).toBe(false)
    })

    it('should return undefined for unsupported parsed account metadata', () => {
      // ARRANGE
      expect.assertions(1)
      const account = createTokenAccountInfo('system')

      // ACT
      const result = getTokenAccountProgramAddress({ account })

      // ASSERT
      expect(result).toBeUndefined()
    })
  })
})
