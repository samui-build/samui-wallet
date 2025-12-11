import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import type { GetTokenAccountsResult } from '@workspace/solana-client/get-token-accounts'
import { useGetBalance } from '@workspace/solana-client-react/use-get-balance'
import { useGetTokenAccounts } from '@workspace/solana-client-react/use-get-token-accounts'
import { useMemo } from 'react'
import { formatBalance } from './format-balance.ts'
import { formatBalanceUsd } from './format-balance-usd.ts'

export interface TokenBalance {
  account: Address
  balance: bigint
  balanceToken?: string
  balanceUsd?: string
  decimals: number
  metadata?: TokenMetadata | undefined
  mint: Address
}

export interface TokenMetadata {
  decimals: number
  icon: string
  id: string
  name: string
  symbol: string
  usdPrice: number
}

export function useGetTokenBalances({ address, network }: { address: Address; network: Network }) {
  const { data: dataBalance, isLoading: isLoadingBalance } = useGetBalance({ address, network })
  const { data: dataTokenAccounts, isLoading: isLoadingTokenAccounts } = useGetTokenAccounts({ address, network })

  const mints = useMemo(() => {
    return [NATIVE_MINT, ...(dataTokenAccounts ?? []).map((t) => t.account.data.parsed.info.mint)]
  }, [dataTokenAccounts])

  const metadata = useGetTokenMetadata(mints)

  return isLoadingBalance || isLoadingTokenAccounts
    ? []
    : mergeData({
        account: address,
        balance: dataBalance?.value ?? 0n,
        metadata: metadata.data ?? [],
        tokenAccounts: dataTokenAccounts ?? [],
      })
}

export function getTokenMetadataQueryOptions(mints: string[]) {
  return queryOptions({
    enabled: !!mints.length,
    networkMode: 'offlineFirst',
    queryFn: () => getTokenMetadata(mints),
    queryKey: ['getTokenMetadata', mints],
    retry: false,
    staleTime: Infinity,
  })
}

export function useGetTokenMetadata(mints: string[]) {
  return useQuery(getTokenMetadataQueryOptions(mints))
}

async function getTokenMetadata(mints: string[]): Promise<TokenMetadata[]> {
  const url = new URL('https://lite-api.jup.ag/tokens/v2/search')
  url.searchParams.append('query', mints.join(','))
  return fetch(url)
    .then((res) => res.json())
    .then((items) =>
      items.map((i: TokenMetadata) => ({
        decimals: i.decimals,
        icon: i.icon,
        id: i.id,
        name: i.id === NATIVE_MINT ? 'Solana' : i.name,
        symbol: i.symbol,
        usdPrice: i.usdPrice,
      })),
    )
}

function mergeData({
  account,
  balance,
  metadata,
  tokenAccounts,
}: {
  account: Address
  balance: bigint
  metadata: TokenMetadata[]
  tokenAccounts: GetTokenAccountsResult
}): TokenBalance[] {
  const solMint = NATIVE_MINT
  const solMetadata = metadata.find((m) => m.id === solMint)
  const solDecimals = solMetadata?.decimals ?? 9
  const solBalance: TokenBalance = {
    account,
    balance,
    balanceToken: formatBalance({ balance, decimals: solDecimals }),
    balanceUsd: formatBalanceUsd({
      balance,
      decimals: solDecimals,
      usdPrice: solMetadata?.usdPrice ?? 0,
    }),
    decimals: solDecimals,
    metadata: solMetadata,
    mint: solMint,
  }

  const tokenBalances: TokenBalance[] = tokenAccounts.map((account) => {
    const mint = account.account.data.parsed.info.mint
    const tokenMetadata = metadata.find((m) => m.id === mint)
    const balance = BigInt(account.account.data.parsed.info.tokenAmount.amount)
    const decimals = account.account.data.parsed.info.tokenAmount.decimals

    return {
      account: account.pubkey,
      balance,
      balanceToken: formatBalance({ balance, decimals }),
      balanceUsd: formatBalanceUsd({
        balance,
        decimals,
        usdPrice: tokenMetadata?.usdPrice ?? 0,
      }),
      decimals,
      metadata: tokenMetadata,
      mint,
    }
  })

  return [solBalance, ...tokenBalances].sort((a, b) => {
    const metadataSort = (b.metadata ? 1 : 0) - (a.metadata ? 1 : 0)
    if (metadataSort !== 0) {
      return metadataSort
    }
    const aValue = (Number(a.balance) / 10 ** a.decimals) * (a.metadata?.usdPrice ?? 0)
    const bValue = (Number(b.balance) / 10 ** b.decimals) * (b.metadata?.usdPrice ?? 0)

    return bValue - aValue
  })
}
