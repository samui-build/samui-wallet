import type { Signature } from '@solana/kit'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { BookmarkTransaction } from '@workspace/db/bookmark-transaction/bookmark-transaction'
import { bookmarkTransactionFindBySignature } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-by-signature'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkTransactionFindBySignature({ signature }: { signature: Signature }) {
  const ctx = useAppContext()
  return useLiveQuery<BookmarkTransaction | null, null>(
    () => bookmarkTransactionFindBySignature(ctx, signature),
    [ctx, signature],
    null,
  )
}
