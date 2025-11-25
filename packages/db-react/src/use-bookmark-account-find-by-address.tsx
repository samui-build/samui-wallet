import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountFindByAddress({ address }: { address: Address }) {
  return useQuery(optionsBookmarkAccount.findByAddress(address))
}
