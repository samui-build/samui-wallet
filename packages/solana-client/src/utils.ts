import { fetchMint } from '@solana-program/token-2022'
import { address } from '@solana/kit'

import type { SolanaClient } from './solana-client'

export const tokenAmountToTransferAmount = (amount: string, decimals: number): bigint => {
  if (Number.isNaN(parseFloat(amount))) {
    throw new Error('Could not parse token quantity: ' + String(amount))
  }
  const formatter = new Intl.NumberFormat('en-US', { useGrouping: false })
  const bigIntAmount = BigInt(
    // @ts-expect-error - scientific notation is supported by `Intl.NumberFormat` but the types are wrong
    formatter.format(`${amount}E${decimals}`).split('.')[0],
  )
  return bigIntAmount
}

export const isTokenNonTransferable = async (client: SolanaClient, mint: string): Promise<boolean> => {
  const { data: mintInfo } = await fetchMint(client.rpc, address(mint))
  if (mintInfo.extensions.__option === 'None') {
    return false
  }
  for (const extension of mintInfo.extensions.value) {
    switch (extension.__kind) {
      case 'NonTransferable':
        return true
    }
  }
  return false
}
