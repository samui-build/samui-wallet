import type { BookmarkTransaction } from '@workspace/db/bookmark-transaction/bookmark-transaction'
import { bookmarkTransactionFindMany } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-many'
import type { BookmarkTransactionFindManyInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-many-input'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkTransactionLive(input: BookmarkTransactionFindManyInput = {}) {
  return useLiveQuery<BookmarkTransaction[], BookmarkTransaction[]>(
    () => bookmarkTransactionFindMany(db, input),
    [input],
    [],
  )
}
