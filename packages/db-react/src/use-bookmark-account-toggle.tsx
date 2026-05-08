import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { type BookmarkAccountToggleMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountToggle(props: BookmarkAccountToggleMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkAccount.toggle(ctx, props))
}
