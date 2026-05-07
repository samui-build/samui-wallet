import { useMutation } from '@tanstack/react-query'
import {
  type BookmarkTransactionUpdateMutateOptions,
  optionsBookmarkTransaction,
} from './options-bookmark-transaction.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useBookmarkTransactionUpdate(props: BookmarkTransactionUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkTransaction.update(ctx, props))
}
