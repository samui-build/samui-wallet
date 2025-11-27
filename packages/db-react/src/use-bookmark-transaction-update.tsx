import { useMutation } from '@tanstack/react-query'
import {
  type BookmarkTransactionUpdateMutateOptions,
  optionsBookmarkTransaction,
} from './options-bookmark-transaction.tsx'

export function useBookmarkTransactionUpdate(props: BookmarkTransactionUpdateMutateOptions = {}) {
  return useMutation(optionsBookmarkTransaction.update(props))
}
