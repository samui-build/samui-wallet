import type { Address, JsonParsedTokenAccount, JsonParsedTokenProgramAccount } from '@solana/kit'
import type { FetchedAccount } from './fetch-account.ts'
import { getAccountTokenType } from './get-account-token-type.ts'

type ExistingFetchedAccount = Extract<FetchedAccount, { exists: true }>
type ExistingFetchedAccountData = ExistingFetchedAccount['data']
type ParsedAccountMeta = Readonly<{
  program: string
  type?: string
}>
type ParsedTokenAccountData = JsonParsedTokenAccount & {
  parsedAccountMeta?: ParsedAccountMeta
}
type ParsedTokenMintData = Extract<JsonParsedTokenProgramAccount, { type: 'mint' }>['info'] & {
  parsedAccountMeta?: ParsedAccountMeta
}

export type AccountTokenAccountInfo = Readonly<{
  extensions: string | undefined
  mint: Address
  mintAmount: null | number
  mintDecimals: number
  type: 'token-account'
}>

export type AccountTokenMintInfo = Readonly<{
  freezeAuthority: Address | null
  mintAuthority: Address | null
  mintDecimals: number
  mintSupply: string
  type: 'token-mint'
}>

export type AccountTokenInfo = AccountTokenAccountInfo | AccountTokenMintInfo

export interface GetAccountTokenInfoOptions {
  account?: FetchedAccount | undefined
}

function getExtensionLabels(extensions: readonly unknown[] | undefined) {
  const result = extensions
    ?.map((extension) => {
      if (!extension || typeof extension !== 'object' || !('extension' in extension)) {
        return null
      }

      return typeof extension.extension === 'string' ? extension.extension : null
    })
    .filter((value): value is string => value !== null)
    .sort((a, b) => a.localeCompare(b))

  return result?.length ? result.join(', ') : undefined
}

function isParsedTokenAccountData(data: ExistingFetchedAccountData): data is ParsedTokenAccountData {
  return !(data instanceof Uint8Array) && data.parsedAccountMeta?.type === 'account'
}

function isParsedTokenMintData(data: ExistingFetchedAccountData): data is ParsedTokenMintData {
  return !(data instanceof Uint8Array) && data.parsedAccountMeta?.type === 'mint'
}

export function getAccountTokenInfo({ account }: GetAccountTokenInfoOptions): AccountTokenInfo | undefined {
  if (!account?.exists) {
    return undefined
  }

  switch (getAccountTokenType({ account })) {
    case 'token-account':
      if (!isParsedTokenAccountData(account.data)) {
        return undefined
      }

      return {
        extensions: getExtensionLabels(account.data.extensions),
        mint: account.data.mint,
        mintAmount: account.data.tokenAmount.uiAmount,
        mintDecimals: account.data.tokenAmount.decimals,
        type: 'token-account',
      }
    case 'token-mint':
      if (!isParsedTokenMintData(account.data)) {
        return undefined
      }

      return {
        freezeAuthority: account.data.freezeAuthority,
        mintAuthority: account.data.mintAuthority,
        mintDecimals: account.data.decimals,
        mintSupply: account.data.supply,
        type: 'token-mint',
      }
    default:
      return undefined
  }
}
