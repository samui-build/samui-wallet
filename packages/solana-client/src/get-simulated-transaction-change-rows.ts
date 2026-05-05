import type { Address } from '@solana/kit'
import { NATIVE_MINT } from './constants.ts'
import type { SimulatePreparedTransactionSuccessResult } from './simulate-prepared-transaction.ts'

export interface SimulatedTransactionChangeRow {
  address: Address
  change: bigint
  decimals: number
  mint: Address
  type: 'sol' | 'token'
}

export interface FormatSimulatedTransactionChangeOptions {
  change: bigint
  decimals: number
}

export interface GetSimulatedTransactionChangeRowsOptions {
  simulation: SimulatePreparedTransactionSuccessResult
}

export type GetSimulatedTransactionChangeRowsResult = SimulatedTransactionChangeRow[]

export function getSimulatedTransactionChangeRows({
  simulation,
}: GetSimulatedTransactionChangeRowsOptions): GetSimulatedTransactionChangeRowsResult {
  const solRows = simulation.solBalanceChanges.map(
    ({ address, change }): SimulatedTransactionChangeRow => ({
      address,
      change,
      decimals: 9,
      mint: NATIVE_MINT,
      type: 'sol',
    }),
  )
  const tokenRows = simulation.tokenBalanceChanges.map(
    ({ account, change, decimals, mint }): SimulatedTransactionChangeRow => ({
      address: account,
      change,
      decimals,
      mint,
      type: 'token',
    }),
  )

  return [...solRows, ...tokenRows].sort((rowA, rowB) => {
    const mintSort = rowA.mint.localeCompare(rowB.mint)
    if (mintSort !== 0) {
      return mintSort
    }

    return rowA.address.localeCompare(rowB.address)
  })
}

export function formatSimulatedTransactionChange({
  change,
  decimals,
}: FormatSimulatedTransactionChangeOptions): string {
  const formattedChange = formatBigIntAmount({ amount: change, decimals })

  return `${change > 0n ? '+' : ''}${formattedChange}`
}

function formatBigIntAmount({ amount, decimals }: { amount: bigint; decimals: number }) {
  const sign = amount < 0n ? '-' : ''
  const absoluteAmount = amount < 0n ? -amount : amount

  if (decimals <= 0) {
    return `${sign}${formatWholeNumber(absoluteAmount.toString())}`
  }

  const scale = 10n ** BigInt(decimals)
  const whole = absoluteAmount / scale
  const fraction = (absoluteAmount % scale).toString().padStart(decimals, '0').replace(/0+$/, '')

  return `${sign}${formatWholeNumber(whole.toString())}${fraction ? `.${fraction}` : ''}`
}

function formatWholeNumber(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
