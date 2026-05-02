import type { Address } from '@solana/kit'
import type { LatestBlockhash } from './get-latest-blockhash.ts'

export interface RawParsedAccount {
  data: RawParsedAccountData
  lamports: bigint | number | string
  owner: Address
}

export type RawParsedAccountData =
  | readonly [string, string]
  | {
      parsed?: {
        info?: unknown
        type?: string
      }
      program?: string
      space?: bigint | number | string
    }

export interface RawSimulateTransactionTokenBalance {
  accountIndex: number
  mint: Address
  owner?: Address | undefined
  programId?: Address | undefined
  uiTokenAmount: {
    amount: bigint | number | string
    decimals?: bigint | number | string | undefined
  }
}

export interface RawSimulateTransactionValue {
  accounts?: readonly (RawParsedAccount | null)[] | undefined
  err: unknown | null
  fee?: bigint | number | string | undefined
  logs: string[] | null
  postBalances?: readonly (bigint | number | string)[] | undefined
  postTokenBalances?: readonly RawSimulateTransactionTokenBalance[] | undefined
  preBalances?: readonly (bigint | number | string)[] | undefined
  preTokenBalances?: readonly RawSimulateTransactionTokenBalance[] | undefined
  unitsConsumed?: bigint | number | string | undefined
}

export interface SimulatePreparedTransactionBaseResult {
  fee: bigint | undefined
  latestBlockhash: LatestBlockhash
  logs: string[]
  solBalanceChanges: SimulatePreparedTransactionSolBalanceChange[]
  tokenBalanceChanges: SimulatePreparedTransactionTokenBalanceChange[]
  unitsConsumed: bigint | undefined
}

export type SimulatePreparedTransactionResult =
  | (SimulatePreparedTransactionBaseResult & {
      error: null
      status: 'success'
    })
  | (SimulatePreparedTransactionBaseResult & {
      error: unknown
      status: 'failure'
    })

export interface SimulatePreparedTransactionSolBalanceChange {
  address: Address
  change: bigint
  postBalance: bigint
  preBalance: bigint
}

export interface SimulatePreparedTransactionTokenBalanceChange {
  account: Address
  change: bigint
  decimals: number
  mint: Address
  owner?: Address | undefined
  postAmount: bigint
  preAmount: bigint
  programId?: Address | undefined
}
