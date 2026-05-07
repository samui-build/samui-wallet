import { useMutation } from '@tanstack/react-query'
import { type BookmarkAccountToggleMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useBookmarkAccountToggle(props: BookmarkAccountToggleMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkAccount.toggle(ctx, props))
}
