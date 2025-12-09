import type { Signature } from '@solana/kit'
import type { BookmarkTransaction } from '@workspace/db/bookmark-transaction/bookmark-transaction'
import { bookmarkTransactionFindBySignature } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-by-signature'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkTransactionFindBySignature({ signature }: { signature: Signature }) {
  return useLiveQuery<BookmarkTransaction | null, null>(
    () => bookmarkTransactionFindBySignature(db, signature),
    [signature],
    null,
  )
}
