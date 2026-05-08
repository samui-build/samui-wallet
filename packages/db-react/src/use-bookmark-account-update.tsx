import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { type BookmarkAccountUpdateMutateOptions, optionsBookmarkAccount } from './options-bookmark-account.tsx'

export function useBookmarkAccountUpdate(props: BookmarkAccountUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkAccount.update(ctx, props))
}
