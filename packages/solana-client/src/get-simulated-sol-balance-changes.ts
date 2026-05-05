import type { Address } from '@solana/kit'
import { maybeBigInt } from './parse-rpc-number.ts'
import type {
  RawParsedAccount,
  SimulatePreparedTransactionSolBalanceChange,
} from './simulate-prepared-transaction-types.ts'

export interface GetSimulatedSolBalanceChangesOptions {
  accountAddresses: Address[]
  postAccounts: readonly (RawParsedAccount | null)[] | undefined
  postBalances: readonly (bigint | number | string)[] | undefined
  preAccounts: readonly (RawParsedAccount | null)[]
  preBalances: readonly (bigint | number | string)[] | undefined
}

export type GetSimulatedSolBalanceChangesResult = SimulatePreparedTransactionSolBalanceChange[]

export function getSimulatedSolBalanceChanges({
  accountAddresses,
  postAccounts,
  postBalances,
  preAccounts,
  preBalances,
}: GetSimulatedSolBalanceChangesOptions): GetSimulatedSolBalanceChangesResult {
  return (
    getSolBalanceChanges({
      accountAddresses,
      postBalances,
      preBalances,
    }) ?? getSolBalanceChangesFromAccounts({ accountAddresses, postAccounts, preAccounts })
  )
}

function getSolBalanceChanges({
  accountAddresses,
  postBalances,
  preBalances,
}: {
  accountAddresses: Address[]
  postBalances: readonly (bigint | number | string)[] | undefined
  preBalances: readonly (bigint | number | string)[] | undefined
}): SimulatePreparedTransactionSolBalanceChange[] | undefined {
  if (!postBalances?.length || !preBalances?.length) {
    return undefined
  }

  return accountAddresses
    .map((address, index) => {
      const postBalance = maybeBigInt(postBalances[index]) ?? 0n
      const preBalance = maybeBigInt(preBalances[index]) ?? 0n

      return {
        address,
        change: postBalance - preBalance,
        postBalance,
        preBalance,
      }
    })
    .filter(({ change }) => change !== 0n)
    .sort((rowA, rowB) => rowA.address.localeCompare(rowB.address))
}

function getSolBalanceChangesFromAccounts({
  accountAddresses,
  postAccounts,
  preAccounts,
}: {
  accountAddresses: Address[]
  postAccounts: readonly (RawParsedAccount | null)[] | undefined
  preAccounts: readonly (RawParsedAccount | null)[]
}): SimulatePreparedTransactionSolBalanceChange[] {
  if (!postAccounts?.length) {
    return []
  }

  const rows: SimulatePreparedTransactionSolBalanceChange[] = []

  for (const [index, address] of accountAddresses.entries()) {
    const postAccount = postAccounts[index]
    const preAccount = preAccounts[index]
    const postBalance = maybeBigInt(postAccount?.lamports) ?? 0n
    const preBalance = maybeBigInt(preAccount?.lamports) ?? 0n

    rows.push({
      address,
      change: postBalance - preBalance,
      postBalance,
      preBalance,
    })
  }

  return rows.filter(({ change }) => change !== 0n).sort((rowA, rowB) => rowA.address.localeCompare(rowB.address))
}
