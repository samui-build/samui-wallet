import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import {
  type BookmarkTransactionUpdateMutateOptions,
  optionsBookmarkTransaction,
} from './options-bookmark-transaction.tsx'

export function useBookmarkTransactionUpdate(props: BookmarkTransactionUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsBookmarkTransaction.update(ctx, props))
}
