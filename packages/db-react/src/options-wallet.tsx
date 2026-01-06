import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { walletDelete } from '@workspace/db/wallet/wallet-delete'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import type { WalletFindManyInput } from '@workspace/db/wallet/wallet-find-many-input'
import { walletReadMnemonic } from '@workspace/db/wallet/wallet-read-mnemonic'
import { walletUpdate } from '@workspace/db/wallet/wallet-update'
import type { WalletUpdateInput } from '@workspace/db/wallet/wallet-update-input'
import { walletUpdateOrder } from '@workspace/db/wallet/wallet-update-order'
import type { WalletUpdateOrderInput } from '@workspace/db/wallet/wallet-update-order-input'
import { optionsSetting } from './options-setting.tsx'
import { queryClient } from './query-client.tsx'

export type WalletCreateMutateOptions = MutateOptions<string, Error, { input: WalletCreateInput }>
export type WalletDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type WalletReadMnemonicMutateOptions = MutateOptions<string, Error, { id: string }>
export type WalletUpdateMutateOptions = MutateOptions<number, Error, { id: string; input: WalletUpdateInput }>
export type WalletUpdateOrderMutateOptions = MutateOptions<void, Error, { input: WalletUpdateOrderInput }>

export const optionsWallet = {
  create: (props: WalletCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: WalletCreateInput }) => walletCreate(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.findMany({}))
        queryClient.invalidateQueries(optionsWallet.findMany({}))
      },
      ...props,
    }),
  delete: (props: WalletDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletDelete(db, id),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsWallet.findMany({}))
      },
      ...props,
    }),
  findMany: (input: WalletFindManyInput) =>
    queryOptions({
      queryFn: () => walletFindMany(db, input),
      queryKey: ['walletFindMany', input],
    }),
  readMnemonic: (props: WalletReadMnemonicMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletReadMnemonic(db, id),
      ...props,
    }),
  update: (props: WalletUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: WalletUpdateInput }) => walletUpdate(db, id, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsWallet.findMany({}))
      },
      ...props,
    }),
  updateOrder: (props: WalletUpdateOrderMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: WalletUpdateOrderInput }) => walletUpdateOrder(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsWallet.findMany({}))
      },
      ...props,
    }),
}
