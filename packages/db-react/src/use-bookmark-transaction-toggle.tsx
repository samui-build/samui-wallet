import { useMutation } from '@tanstack/react-query'
import {
  type BookmarkTransactionToggleMutateOptions,
  optionsBookmarkTransaction,
} from './options-bookmark-transaction.tsx'

export function useBookmarkTransactionToggle(props: BookmarkTransactionToggleMutateOptions = {}) {
  return useMutation(optionsBookmarkTransaction.toggle(props))
}
