import type { Address } from '@solana/kit'
import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { bookmarkAccountCreate } from '@workspace/db/bookmark-account/bookmark-account-create'
import type { BookmarkAccountCreateInput } from '@workspace/db/bookmark-account/bookmark-account-create-input'
import { bookmarkAccountDelete } from '@workspace/db/bookmark-account/bookmark-account-delete'
import { bookmarkAccountFindByAddress } from '@workspace/db/bookmark-account/bookmark-account-find-by-address'
import { bookmarkAccountFindMany } from '@workspace/db/bookmark-account/bookmark-account-find-many'
import type { BookmarkAccountFindManyInput } from '@workspace/db/bookmark-account/bookmark-account-find-many-input'
import { bookmarkAccountFindUnique } from '@workspace/db/bookmark-account/bookmark-account-find-unique'
import { bookmarkAccountUpdate } from '@workspace/db/bookmark-account/bookmark-account-update'
import type { BookmarkAccountUpdateInput } from '@workspace/db/bookmark-account/bookmark-account-update-input'
import { db } from '@workspace/db/db'
import { queryClient } from './query-client.tsx'

export type BookmarkAccountCreateMutateOptions = MutateOptions<
  string,
  Error,
  { input: Omit<BookmarkAccountCreateInput, 'address'> }
> & {
  address: Address
}
export type BookmarkAccountDeleteMutateOptions = MutateOptions<void, Error, { id: string }> & {
  address: Address
}
export type BookmarkAccountUpdateMutateOptions = MutateOptions<
  number,
  Error,
  { address: Address; input: BookmarkAccountUpdateInput }
>

export const optionsBookmarkAccount = {
  create: (props: BookmarkAccountCreateMutateOptions) =>
    mutationOptions({
      mutationFn: ({ input }: { input: Omit<BookmarkAccountCreateInput, 'address'> }) =>
        bookmarkAccountCreate(db, { ...input, address: props.address }),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsBookmarkAccount.findByAddress(props.address))
      },
      ...props,
    }),
  delete: (props: BookmarkAccountDeleteMutateOptions) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => bookmarkAccountDelete(db, id),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsBookmarkAccount.findByAddress(props.address))
      },
      ...props,
    }),
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
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => bookmarkAccountFindUnique(db, id),
      queryKey: ['bookmarkAccountFindUnique', id],
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
