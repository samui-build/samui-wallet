import { address, getBase64Decoder } from '@solana/kit'
import { AccountState, getMintEncoder, getTokenEncoder } from '@solana-program/token'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SYSTEM_ACCOUNT, TOKEN_PROGRAM_ADDRESS } from '../src/constants.ts'
import { getSimulatedTokenBalanceChanges } from '../src/get-simulated-token-balance-changes.ts'
import type { RawParsedAccount } from '../src/simulate-prepared-transaction-types.ts'

describe('get-simulated-token-balance-changes', () => {
  const mint = address('So11111111111111111111111111111111111111114')
  const owner = address('So11111111111111111111111111111111111111115')
  const sourceAccount = address('So11111111111111111111111111111111111111112')
  const tokenAccount = address('So11111111111111111111111111111111111111113')

  describe('expected behavior', () => {
    it('should calculate token balance changes from pre and post token balance arrays', () => {
      // ARRANGE
      expect.assertions(1)
      const accountAddresses = [sourceAccount, tokenAccount]

      // ACT
      const result = getSimulatedTokenBalanceChanges({
        accountAddresses,
        postAccounts: undefined,
        postTokenBalances: [
          {
            accountIndex: 0,
            mint,
            owner,
            programId: TOKEN_PROGRAM_ADDRESS,
            uiTokenAmount: { amount: '30', decimals: '6' },
          },
          {
            accountIndex: 1,
            mint,
            owner,
            programId: TOKEN_PROGRAM_ADDRESS,
            uiTokenAmount: { amount: 70n, decimals: 6n },
          },
        ],
        preAccounts: [],
        preTokenBalances: [
          {
            accountIndex: 0,
            mint,
            owner,
            programId: TOKEN_PROGRAM_ADDRESS,
            uiTokenAmount: { amount: '100', decimals: 6 },
          },
        ],
      })

      // ASSERT
      expect(result).toEqual([
        {
          account: sourceAccount,
          change: -70n,
          decimals: 6,
          mint,
          owner,
          postAmount: 30n,
          preAmount: 100n,
          programId: TOKEN_PROGRAM_ADDRESS,
        },
        {
          account: tokenAccount,
          change: 70n,
          decimals: 6,
          mint,
          owner,
          postAmount: 70n,
          preAmount: 0n,
          programId: TOKEN_PROGRAM_ADDRESS,
        },
      ])
    })

    it('should calculate closed-account token balance changes from parsed account fallback data', () => {
      // ARRANGE
      expect.assertions(1)
      const preAccount = createParsedTokenAccount({ amount: '12', decimals: 6 })

      // ACT
      const result = getSimulatedTokenBalanceChanges({
        accountAddresses: [tokenAccount],
        postAccounts: [null],
        postTokenBalances: undefined,
        preAccounts: [preAccount],
        preTokenBalances: undefined,
      })

      // ASSERT
      expect(result).toEqual([
        {
          account: tokenAccount,
          change: -12n,
          decimals: 6,
          mint,
          owner,
          postAmount: 0n,
          preAmount: 12n,
          programId: TOKEN_PROGRAM_ADDRESS,
        },
      ])
    })

    it('should calculate closed-account token balance changes from base64 account fallback data', () => {
      // ARRANGE
      expect.assertions(1)
      const mintAccount = createBase64MintAccount({ decimals: 8 })
      const preAccount = createBase64TokenAccount({ amount: 123_456n })

      // ACT
      const result = getSimulatedTokenBalanceChanges({
        accountAddresses: [mint, tokenAccount],
        postAccounts: [mintAccount, null],
        postTokenBalances: undefined,
        preAccounts: [mintAccount, preAccount],
        preTokenBalances: undefined,
      })

      // ASSERT
      expect(result).toEqual([
        {
          account: tokenAccount,
          change: -123_456n,
          decimals: 8,
          mint,
          owner,
          postAmount: 0n,
          preAmount: 123_456n,
          programId: TOKEN_PROGRAM_ADDRESS,
        },
      ])
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should ignore token-looking accounts that are not owned by a token program', () => {
      // ARRANGE
      expect.assertions(1)
      const preAccount = createParsedTokenAccount({ amount: '12', decimals: 6, ownerAddress: SYSTEM_ACCOUNT })

      // ACT
      const result = getSimulatedTokenBalanceChanges({
        accountAddresses: [tokenAccount],
        postAccounts: [null],
        postTokenBalances: undefined,
        preAccounts: [preAccount],
        preTokenBalances: undefined,
      })

      // ASSERT
      expect(result).toEqual([])
    })
  })

  function createParsedTokenAccount({
    amount,
    decimals,
    ownerAddress = TOKEN_PROGRAM_ADDRESS,
  }: {
    amount: string
    decimals: number
    ownerAddress?: typeof SYSTEM_ACCOUNT | typeof TOKEN_PROGRAM_ADDRESS
  }): RawParsedAccount {
    return {
      data: {
        parsed: {
          info: {
            mint,
            owner,
            tokenAmount: {
              amount,
              decimals,
            },
          },
          type: 'account',
        },
        program: 'spl-token',
        space: 165,
      },
      lamports: 2_039_280n,
      owner: ownerAddress,
    }
  }

  function createBase64MintAccount({ decimals }: { decimals: number }): RawParsedAccount {
    return {
      data: [
        getBase64Decoder().decode(
          getMintEncoder().encode({
            decimals,
            freezeAuthority: null,
            isInitialized: true,
            mintAuthority: null,
            supply: 1_000_000n,
          }),
        ),
        'base64',
      ],
      lamports: 1_461_600n,
      owner: TOKEN_PROGRAM_ADDRESS,
    }
  }

  function createBase64TokenAccount({ amount }: { amount: bigint }): RawParsedAccount {
    return {
      data: [
        getBase64Decoder().decode(
          getTokenEncoder().encode({
            amount,
            closeAuthority: null,
            delegate: null,
            delegatedAmount: 0n,
            isNative: null,
            mint,
            owner,
            state: AccountState.Initialized,
          }),
        ),
        'base64',
      ],
      lamports: 2_039_280n,
      owner: TOKEN_PROGRAM_ADDRESS,
    }
  }
})
