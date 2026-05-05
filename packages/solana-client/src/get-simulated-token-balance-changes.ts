import { type Address, assertIsAddress, getBase64Encoder } from '@solana/kit'
import { getMintDecoder, getTokenDecoder } from '@solana-program/token'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from './constants.ts'
import { maybeBigInt, maybeNumber } from './parse-rpc-number.ts'
import type {
  RawParsedAccount,
  RawSimulateTransactionTokenBalance,
  SimulatePreparedTransactionTokenBalanceChange,
} from './simulate-prepared-transaction-types.ts'

interface ParsedTokenAccountBalance {
  account: Address
  amount: bigint
  decimals?: number | undefined
  mint: Address
  owner?: Address | undefined
  programId?: Address | undefined
}

export interface GetSimulatedTokenBalanceChangesOptions {
  accountAddresses: Address[]
  postAccounts: readonly (RawParsedAccount | null)[] | undefined
  postTokenBalances: readonly RawSimulateTransactionTokenBalance[] | undefined
  preAccounts: readonly (RawParsedAccount | null)[]
  preTokenBalances: readonly RawSimulateTransactionTokenBalance[] | undefined
}

export type GetSimulatedTokenBalanceChangesResult = SimulatePreparedTransactionTokenBalanceChange[]

export function getSimulatedTokenBalanceChanges({
  accountAddresses,
  postAccounts,
  postTokenBalances,
  preAccounts,
  preTokenBalances,
}: GetSimulatedTokenBalanceChangesOptions): GetSimulatedTokenBalanceChangesResult {
  return (
    getTokenBalanceChanges({
      accountAddresses,
      postTokenBalances,
      preTokenBalances,
    }) ?? getTokenBalanceChangesFromAccounts({ accountAddresses, postAccounts, preAccounts })
  )
}

function getTokenBalanceChanges({
  accountAddresses,
  postTokenBalances,
  preTokenBalances,
}: {
  accountAddresses: Address[]
  postTokenBalances: readonly RawSimulateTransactionTokenBalance[] | undefined
  preTokenBalances: readonly RawSimulateTransactionTokenBalance[] | undefined
}): SimulatePreparedTransactionTokenBalanceChange[] | undefined {
  if (!postTokenBalances?.length && !preTokenBalances?.length) {
    return undefined
  }

  const balances = new Map<
    string,
    { post?: RawSimulateTransactionTokenBalance; pre?: RawSimulateTransactionTokenBalance }
  >()

  for (const balance of preTokenBalances ?? []) {
    balances.set(getTokenBalanceKey(balance), { pre: balance })
  }

  for (const balance of postTokenBalances ?? []) {
    const key = getTokenBalanceKey(balance)
    balances.set(key, { ...balances.get(key), post: balance })
  }

  const rows: SimulatePreparedTransactionTokenBalanceChange[] = []

  for (const { post, pre } of balances.values()) {
    const balance = post ?? pre
    if (!balance) {
      continue
    }

    const account = accountAddresses[balance.accountIndex]
    if (!account) {
      continue
    }

    const owner = post?.owner ?? pre?.owner
    const postAmount = maybeBigInt(post?.uiTokenAmount.amount) ?? 0n
    const preAmount = maybeBigInt(pre?.uiTokenAmount.amount) ?? 0n
    const programId = post?.programId ?? pre?.programId

    rows.push({
      account,
      change: postAmount - preAmount,
      decimals: maybeNumber(post?.uiTokenAmount.decimals ?? pre?.uiTokenAmount.decimals) ?? 0,
      mint: balance.mint,
      ...(owner ? { owner } : undefined),
      postAmount,
      preAmount,
      ...(programId ? { programId } : undefined),
    })
  }

  return rows
    .filter(isNonZeroTokenBalanceChange)
    .sort((rowA, rowB) => `${rowA.account}:${rowA.mint}`.localeCompare(`${rowB.account}:${rowB.mint}`))
}

function getTokenBalanceChangesFromAccounts({
  accountAddresses,
  postAccounts,
  preAccounts,
}: {
  accountAddresses: Address[]
  postAccounts: readonly (RawParsedAccount | null)[] | undefined
  preAccounts: readonly (RawParsedAccount | null)[]
}): SimulatePreparedTransactionTokenBalanceChange[] {
  if (!postAccounts?.length) {
    return []
  }

  const mintDecimals = getMintDecimalsByAddress({ accountAddresses, postAccounts, preAccounts })
  const rows: SimulatePreparedTransactionTokenBalanceChange[] = []

  for (const [index, account] of accountAddresses.entries()) {
    const post = getParsedTokenAccountBalance(account, postAccounts[index])
    const pre = getParsedTokenAccountBalance(account, preAccounts[index])
    const balance = post ?? pre
    if (!balance) {
      continue
    }

    rows.push({
      account,
      change: (post?.amount ?? 0n) - (pre?.amount ?? 0n),
      decimals: post?.decimals ?? pre?.decimals ?? mintDecimals.get(balance.mint) ?? 0,
      mint: balance.mint,
      ...(balance.owner ? { owner: balance.owner } : undefined),
      postAmount: post?.amount ?? 0n,
      preAmount: pre?.amount ?? 0n,
      ...(balance.programId ? { programId: balance.programId } : undefined),
    })
  }

  return rows
    .filter(isNonZeroTokenBalanceChange)
    .sort((rowA, rowB) => `${rowA.account}:${rowA.mint}`.localeCompare(`${rowB.account}:${rowB.mint}`))
}

function getParsedTokenAccountBalance(
  account: Address,
  accountInfo: RawParsedAccount | null | undefined,
): ParsedTokenAccountBalance | undefined {
  const decodedData = getDecodedTokenAccountData(accountInfo)
  if (decodedData) {
    return {
      account,
      amount: decodedData.amount,
      mint: decodedData.mint,
      owner: decodedData.owner,
      ...(accountInfo?.owner ? { programId: accountInfo.owner } : undefined),
    }
  }

  const parsedData = getParsedTokenAccountData(accountInfo)
  if (!parsedData) {
    return undefined
  }

  const mint = getAddressFromRecord(parsedData, 'mint')
  if (!mint) {
    return undefined
  }

  const tokenAmount = getRecord(parsedData['tokenAmount'])
  const amount = maybeBigInt(tokenAmount?.['amount'])
  if (amount === undefined) {
    return undefined
  }

  return {
    account,
    amount,
    decimals: getNumberFromRecord(tokenAmount, 'decimals') ?? 0,
    mint,
    ...(getAddressFromRecord(parsedData, 'owner') ? { owner: getAddressFromRecord(parsedData, 'owner') } : undefined),
    ...(accountInfo?.owner ? { programId: accountInfo.owner } : undefined),
  }
}

function getMintDecimalsByAddress({
  accountAddresses,
  postAccounts,
  preAccounts,
}: {
  accountAddresses: Address[]
  postAccounts: readonly (RawParsedAccount | null)[]
  preAccounts: readonly (RawParsedAccount | null)[]
}) {
  const mintDecimals = new Map<Address, number>()

  for (const [index, account] of accountAddresses.entries()) {
    const decimals = getDecodedMintDecimals(postAccounts[index]) ?? getDecodedMintDecimals(preAccounts[index])
    if (decimals !== undefined) {
      mintDecimals.set(account, decimals)
    }
  }

  return mintDecimals
}

function getDecodedMintDecimals(accountInfo: RawParsedAccount | null | undefined): number | undefined {
  const data = getAccountDataBytes(accountInfo)
  if (!data) {
    return undefined
  }

  try {
    return getMintDecoder().decode(data).decimals
  } catch {
    return undefined
  }
}

function getDecodedTokenAccountData(accountInfo: RawParsedAccount | null | undefined) {
  if (!isOwnedByTokenProgram(accountInfo)) {
    return undefined
  }

  const data = getAccountDataBytes(accountInfo)
  if (!data) {
    return undefined
  }

  try {
    return getTokenDecoder().decode(data)
  } catch {
    return undefined
  }
}

function getAccountDataBytes(accountInfo: RawParsedAccount | null | undefined) {
  if (!accountInfo || !Array.isArray(accountInfo.data) || accountInfo.data[1] !== 'base64') {
    return undefined
  }

  return getBase64Encoder().encode(accountInfo.data[0])
}

function getParsedTokenAccountData(accountInfo: RawParsedAccount | null | undefined) {
  if (!isOwnedByTokenProgram(accountInfo) || typeof accountInfo.data !== 'object' || !('parsed' in accountInfo.data)) {
    return undefined
  }

  const parsed = accountInfo.data.parsed
  if (parsed?.type !== 'account') {
    return undefined
  }

  return getRecord(parsed.info)
}

function getAddressFromRecord(record: Record<string, unknown> | undefined, key: string): Address | undefined {
  const value = record?.[key]
  if (typeof value !== 'string') {
    return undefined
  }

  try {
    assertIsAddress(value)
    return value
  } catch {
    return undefined
  }
}

function getNumberFromRecord(record: Record<string, unknown> | undefined, key: string): number | undefined {
  return maybeNumber(record?.[key])
}

function getTokenBalanceKey({ accountIndex, mint }: RawSimulateTransactionTokenBalance) {
  return `${accountIndex}:${mint}`
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  return value as Record<string, unknown>
}

function isNonZeroTokenBalanceChange(
  row: SimulatePreparedTransactionTokenBalanceChange,
): row is SimulatePreparedTransactionTokenBalanceChange {
  return row.change !== 0n
}

function isOwnedByTokenProgram(accountInfo: RawParsedAccount | null | undefined): accountInfo is RawParsedAccount {
  return accountInfo?.owner === TOKEN_2022_PROGRAM_ADDRESS || accountInfo?.owner === TOKEN_PROGRAM_ADDRESS
}
