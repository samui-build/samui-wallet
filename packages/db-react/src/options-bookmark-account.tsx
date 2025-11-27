import type { Address } from '@solana/kit'
import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { bookmarkAccountFindByAddress } from '@workspace/db/bookmark-account/bookmark-account-find-by-address'
import { bookmarkAccountFindMany } from '@workspace/db/bookmark-account/bookmark-account-find-many'
import type { BookmarkAccountFindManyInput } from '@workspace/db/bookmark-account/bookmark-account-find-many-input'
import { bookmarkAccountToggle } from '@workspace/db/bookmark-account/bookmark-account-toggle'
import { bookmarkAccountUpdate } from '@workspace/db/bookmark-account/bookmark-account-update'
import type { BookmarkAccountUpdateInput } from '@workspace/db/bookmark-account/bookmark-account-update-input'
import { db } from '@workspace/db/db'
import { queryClient } from './query-client.tsx'

export type BookmarkAccountToggleMutateOptions = MutateOptions<'created' | 'deleted', Error, { address: Address }>
export type BookmarkAccountUpdateMutateOptions = MutateOptions<
  number,
  Error,
  { address: Address; input: BookmarkAccountUpdateInput }
>
export const optionsBookmarkAccount = {
  findByAddress: (address: Address) =>
    queryOptions({
      queryFn: () => bookmarkAccountFindByAddress(db, address),
      queryKey: ['bookmarkAccountFindByAddress', address],
    }),
  findMany: (input: BookmarkAccountFindManyInput) =>
    queryOptions({
      queryFn: () => bookmarkAccountFindMany(db, input),
      queryKey: ['bookmarkAccountFindMany', input],
    }),
  toggle: (props: BookmarkAccountToggleMutateOptions) =>
    mutationOptions({
      mutationFn: ({ address }: { address: Address }) => bookmarkAccountToggle(db, address),
      onSuccess: (_, { address }) => {
        queryClient.invalidateQueries(optionsBookmarkAccount.findByAddress(address))
      },
      ...props,
    }),
  update: (props: BookmarkAccountUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; address: Address; input: BookmarkAccountUpdateInput }) =>
        bookmarkAccountUpdate(db, id, input),
      onSuccess: (_, { address }) => {
        queryClient.invalidateQueries(optionsBookmarkAccount.findByAddress(address))
      },
      ...props,
    }),
}
