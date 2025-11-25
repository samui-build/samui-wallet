import { useQuery } from '@tanstack/react-query'
import type { BookmarkAccountFindManyInput } from '@workspace/db/bookmark-account/bookmark-account-find-many-input'
import { optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountFindMany({ input }: { input: BookmarkAccountFindManyInput }) {
  return useQuery(optionsBookmarkAccount.findMany(input))
}
