import type { Signature } from '@solana/kit'
import { type MutateOptions, mutationOptions } from '@tanstack/react-query'
import { bookmarkTransactionToggle } from '@workspace/db/bookmark-transaction/bookmark-transaction-toggle'
import { bookmarkTransactionUpdate } from '@workspace/db/bookmark-transaction/bookmark-transaction-update'
import type { BookmarkTransactionUpdateInput } from '@workspace/db/bookmark-transaction/bookmark-transaction-update-input'
import type { DbContext } from '@workspace/db/db-context'

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
  toggle: (ctx: DbContext, props: BookmarkTransactionToggleMutateOptions) =>
    mutationOptions({
      mutationFn: ({ signature }: { signature: Signature }) => bookmarkTransactionToggle(ctx, signature),
      ...props,
    }),
  update: (ctx: DbContext, props: BookmarkTransactionUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; signature: Signature; input: BookmarkTransactionUpdateInput }) =>
        bookmarkTransactionUpdate(ctx, id, input),
      ...props,
    }),
}
