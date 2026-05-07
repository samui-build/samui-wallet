import { useMutation } from '@tanstack/react-query'
import {
  type BookmarkTransactionToggleMutateOptions,
  optionsBookmarkTransaction,
} from './options-bookmark-transaction.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useBookmarkTransactionToggle(props: BookmarkTransactionToggleMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkTransaction.toggle(ctx, props))
}
