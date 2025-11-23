import { useMutation } from '@tanstack/react-query'
import { type BookmarkAccountCreateMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountCreate(props: BookmarkAccountCreateMutateOptions) {
  return useMutation(optionsBookmarkAccount.create(props))
}
