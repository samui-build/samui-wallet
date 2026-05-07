import type { BookmarkTransaction } from '@workspace/db/bookmark-transaction/bookmark-transaction'
import { bookmarkTransactionFindMany } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-many'
import type { BookmarkTransactionFindManyInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-many-input'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAppContext } from './use-app-context.tsx'

export function useBookmarkTransactionLive(input: BookmarkTransactionFindManyInput = {}) {
  const ctx = useAppContext()
  return useLiveQuery<BookmarkTransaction[], BookmarkTransaction[]>(
    () => bookmarkTransactionFindMany(ctx, input),
    [ctx, input],
    [],
  )
}
