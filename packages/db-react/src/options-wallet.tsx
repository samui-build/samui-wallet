import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { walletDelete } from '@workspace/db/wallet/wallet-delete'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import type { WalletFindManyInput } from '@workspace/db/wallet/wallet-find-many-input'
import { walletFindUnique } from '@workspace/db/wallet/wallet-find-unique'
import { walletReadMnemonic } from '@workspace/db/wallet/wallet-read-mnemonic'
import { walletSetActive } from '@workspace/db/wallet/wallet-set-active'
import { walletUpdate } from '@workspace/db/wallet/wallet-update'
import type { WalletUpdateInput } from '@workspace/db/wallet/wallet-update-input'
import { optionsSetting } from './options-setting.tsx'
import { queryClient } from './query-client.tsx'

export type WalletCreateMutateOptions = MutateOptions<string, Error, { input: WalletCreateInput }>
export type WalletDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type WalletReadMnemonicMutateOptions = MutateOptions<string, Error, { id: string }>
export type WalletSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type WalletUpdateMutateOptions = MutateOptions<number, Error, { input: WalletUpdateInput }>

export const optionsWallet = {
  create: (props: WalletCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: WalletCreateInput }) => walletCreate(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.getAll())
        queryClient.invalidateQueries(optionsSetting.getValue('activeWalletId'))
      },
      ...props,
    }),
  delete: (props: WalletDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletDelete(db, id),
      ...props,
    }),
  findMany: (input: WalletFindManyInput) =>
    queryOptions({
      queryFn: () => walletFindMany(db, input),
      queryKey: ['walletFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => walletFindUnique(db, id),
      queryKey: ['walletFindUnique', id],
    }),
  readMnemonic: (props: WalletReadMnemonicMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletReadMnemonic(db, id),
      ...props,
    }),
  setActive: (props: WalletSetActiveMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletSetActive(db, id),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.getAll())
        queryClient.invalidateQueries(optionsSetting.getValue('activeWalletId'))
        queryClient.invalidateQueries(optionsSetting.getValue('activeAccountId'))
      },
      ...props,
    }),
  update: (props: WalletUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: WalletUpdateInput }) => walletUpdate(db, id, input),
      ...props,
    }),
}
