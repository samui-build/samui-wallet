import { useQuery } from '@tanstack/react-query'
import { optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountFindUnique({ id }: { id: string }) {
  return useQuery(optionsBookmarkAccount.findUnique(id))
}
