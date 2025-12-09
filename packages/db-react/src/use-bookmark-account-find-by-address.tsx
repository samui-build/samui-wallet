import type { Address } from '@solana/kit'
import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { bookmarkAccountFindByAddress } from '@workspace/db/bookmark-account/bookmark-account-find-by-address'
import { db } from '@workspace/db/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkAccountFindByAddress({ address }: { address: Address }) {
  return useLiveQuery<null | BookmarkAccount, null>(() => bookmarkAccountFindByAddress(db, address), [address], null)
}
