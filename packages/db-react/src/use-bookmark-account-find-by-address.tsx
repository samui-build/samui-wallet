import type { Address } from '@solana/kit'
import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { bookmarkAccountFindByAddress } from '@workspace/db/bookmark-account/bookmark-account-find-by-address'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAppContext } from './use-app-context.tsx'

export function useBookmarkAccountFindByAddress({ address }: { address: Address }) {
  const ctx = useAppContext()
  return useLiveQuery<null | BookmarkAccount, null>(
    () => bookmarkAccountFindByAddress(ctx, address),
    [address, ctx],
    null,
  )
}
