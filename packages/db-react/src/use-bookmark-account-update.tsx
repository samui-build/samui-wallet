import { useMutation } from '@tanstack/react-query'
import { type BookmarkAccountUpdateMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useBookmarkAccountUpdate(props: BookmarkAccountUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkAccount.update(ctx, props))
}
