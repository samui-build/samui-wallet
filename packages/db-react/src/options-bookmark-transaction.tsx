import type { Signature } from '@solana/kit'
import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { bookmarkTransactionFindBySignature } from '@workspace/db/bookmark-transaction/bookmark-transaction-find-by-signature'
import { bookmarkTransactionToggle } from '@workspace/db/bookmark-transaction/bookmark-transaction-toggle'
import { bookmarkTransactionUpdate } from '@workspace/db/bookmark-transaction/bookmark-transaction-update'
import type { BookmarkTransactionUpdateInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-update-input'
import { db } from '@workspace/db/db'
import { queryClient } from './query-client.tsx'

export type BookmarkTransactionToggleMutateOptions = MutateOptions<
  'created' | 'deleted',
  Error,
  { signature: Signature }
>
export type BookmarkTransactionUpdateMutateOptions = MutateOptions<
  number,
  Error,
  { signature: Signature; input: BookmarkTransactionUpdateInput }
>
export const optionsBookmarkTransaction = {
  findBySignature: (signature: Signature) =>
    queryOptions({
      queryFn: () => bookmarkTransactionFindBySignature(db, signature),
      queryKey: ['bookmarkTransactionFindBySignature', signature],
    }),
  toggle: (props: BookmarkTransactionToggleMutateOptions) =>
    mutationOptions({
      mutationFn: ({ signature }: { signature: Signature }) => bookmarkTransactionToggle(db, signature),
      onSuccess: (_, { signature }) => {
        queryClient.invalidateQueries(optionsBookmarkTransaction.findBySignature(signature))
      },
      ...props,
    }),
  update: (props: BookmarkTransactionUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; signature: Signature; input: BookmarkTransactionUpdateInput }) =>
        bookmarkTransactionUpdate(db, id, input),
      onSuccess: (_, { signature }) => {
        queryClient.invalidateQueries(optionsBookmarkTransaction.findBySignature(signature))
      },
      ...props,
    }),
}
