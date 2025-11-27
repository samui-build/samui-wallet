import type { Signature } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { optionsBookmarkTransaction } from './options-bookmark-transaction.tsx'

export function useBookmarkTransactionFindBySignature({ signature }: { signature: Signature }) {
  return useQuery(optionsBookmarkTransaction.findBySignature(signature))
}
