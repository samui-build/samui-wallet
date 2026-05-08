import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import {
  type BookmarkTransactionToggleMutateOptions,
  optionsBookmarkTransaction,
} from './options-bookmark-transaction.tsx'

export function useBookmarkTransactionToggle(props: BookmarkTransactionToggleMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkTransaction.toggle(ctx, props))
}
