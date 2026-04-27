import type { Address, Lamports } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { createStakeAccount } from '@workspace/solana-client/create-stake-account'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { getStakeAccountsQueryOptions } from './use-get-stake-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export interface CreateStakeAccountInput {
  amount: Lamports
  vote: Address
}

export function createStakeAccountMutationOptions({
  address,
  client,
  queryClient,
  getTransactionSigner,
  network,
}: {
  address: Address
  client: SolanaClient
  getTransactionSigner: GetTransactionSigner
  network: Network
  queryClient: QueryClient
}) {
  return mutationOptions({
    mutationFn: async ({ amount, vote }: CreateStakeAccountInput) => {
      const transactionSigner = await getTransactionSigner()
      return createStakeAccount(client, {
        amount,
        transactionSigner,
        vote,
      })
    },
    onError: () => {
      toastError('Failed to stake SOL.')
    },
    onSuccess: async ({ signature }) => {
      await invalidateStakeAccountQueries({ address, client, network, queryClient })
      toastSuccess(`Stake transaction confirmed: ${ellipsify(signature, 6, '...')}`)
    },
  })
}

export function useCreateStakeAccount({
  address,
  getTransactionSigner,
  network,
}: {
  address: Address
  getTransactionSigner: GetTransactionSigner
  network: Network
}) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()

  return useMutation(createStakeAccountMutationOptions({ address, client, getTransactionSigner, network, queryClient }))
}

async function invalidateStakeAccountQueries({
  address,
  client,
  queryClient,
  network,
}: {
  address: Address
  client: SolanaClient
  queryClient: QueryClient
  network: Network
}) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: getStakeAccountsQueryOptions({ address, client, network }).queryKey,
    }),
  ])
}
