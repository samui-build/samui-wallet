import { useMutation } from '@tanstack/react-query'
import { type BookmarkAccountUpdateMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountUpdate(props: BookmarkAccountUpdateMutateOptions = {}) {
  return useMutation(optionsBookmarkAccount.update(props))
}
