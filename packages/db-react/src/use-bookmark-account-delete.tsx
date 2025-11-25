import { useMutation } from '@tanstack/react-query'
import { type BookmarkAccountDeleteMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountDelete(props: BookmarkAccountDeleteMutateOptions) {
  return useMutation(optionsBookmarkAccount.delete(props))
}
