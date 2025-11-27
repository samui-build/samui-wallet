import { useMutation } from '@tanstack/react-query'
import { type BookmarkAccountToggleMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountToggle(props: BookmarkAccountToggleMutateOptions = {}) {
  return useMutation(optionsBookmarkAccount.toggle(props))
}
