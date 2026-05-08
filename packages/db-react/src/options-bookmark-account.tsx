import type { Address } from '@solana/kit'
import { type MutateOptions, mutationOptions } from '@tanstack/react-query'
import { bookmarkAccountToggle } from '@workspace/db/bookmark-account/bookmark-account-toggle'
import { bookmarkAccountUpdate } from '@workspace/db/bookmark-account/bookmark-account-update'
import type { BookmarkAccountUpdateInput } from '@workspace/db/bookmark-account/bookmark-account-update-input'
import type { DbContext } from '@workspace/db/db-context'

export type BookmarkAccountToggleMutateOptions = MutateOptions<'created' | 'deleted', Error, { address: Address }>
export type BookmarkAccountUpdateMutateOptions = MutateOptions<
  number,
  Error,
  { address: Address; input: BookmarkAccountUpdateInput }
>

export const optionsBookmarkAccount = {
  toggle: (ctx: DbContext, props: BookmarkAccountToggleMutateOptions) =>
    mutationOptions({
      mutationFn: ({ address }: { address: Address }) => bookmarkAccountToggle(ctx, address),
      ...props,
    }),
  update: (ctx: DbContext, props: BookmarkAccountUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; address: Address; input: BookmarkAccountUpdateInput }) =>
        bookmarkAccountUpdate(ctx, id, input),
      ...props,
    }),
}
