import { useQuery } from '@tanstack/react-query'
import type { BookmarkTransactionFindManyInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-many-input'
import { optionsBookmarkTransaction } from './options-bookmark-transaction.tsx'

export function useBookmarkTransactionFindMany({ input }: { input: BookmarkTransactionFindManyInput }) {
  return useQuery(optionsBookmarkTransaction.findMany(input))
}
