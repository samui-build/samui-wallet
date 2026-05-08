import type { Address } from '@solana/kit'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { bookmarkAccountFindByAddress } from '@workspace/db/bookmark-account/bookmark-account-find-by-address'
import { useLiveQuery } from 'dexie-react-hooks'

export function useBookmarkAccountFindByAddress({ address }: { address: Address }) {
  const ctx = useAppContext()
  return useLiveQuery<null | BookmarkAccount, null>(
    () => bookmarkAccountFindByAddress(ctx, address),
    [address, ctx],
    null,
  )
}
