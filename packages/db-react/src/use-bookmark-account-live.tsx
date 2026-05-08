import { useAppContext } from '@workspace/context-react/use-app-context'
import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { bookmarkAccountFindMany } from '@workspace/db/bookmark-account/bookmark-account-find-many'
import type { BookmarkAccountFindManyInput } from '@workspace/db/bookmark-account/bookmark-account-find-many-input'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkAccountLive(input: BookmarkAccountFindManyInput = {}) {
  const ctx = useAppContext()
  return useLiveQuery<BookmarkAccount[], BookmarkAccount[]>(() => bookmarkAccountFindMany(ctx, input), [ctx, input], [])
}
