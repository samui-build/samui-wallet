import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { bookmarkAccountFindMany } from '@workspace/db/bookmark-account/bookmark-account-find-many'
import type { BookmarkAccountFindManyInput } from '@workspace/db/bookmark-account/bookmark-account-find-many-input'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkAccountLive(input: BookmarkAccountFindManyInput = {}) {
  return useLiveQuery<BookmarkAccount[], BookmarkAccount[]>(() => bookmarkAccountFindMany(db, input), [input], [])
}
