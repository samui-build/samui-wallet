import type { Address } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { closeStakeAccount } from '@workspace/solana-client/close-stake-account'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { getStakeAccountsQueryOptions } from './use-get-stake-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function closeStakeAccountMutationOptions({
  address,
  client,
  getTransactionSigner,
  network,
  queryClient,
}: {
  address: Address
  client: SolanaClient
  getTransactionSigner: GetTransactionSigner
  network: Network
  queryClient: QueryClient
}) {
  return mutationOptions({
    mutationFn: async (stakeAccount: StakeAccount) => {
      const transactionSigner = await getTransactionSigner()
      return closeStakeAccount(client, {
        amount: stakeAccount.lamports,
        recipient: transactionSigner.address,
        stake: stakeAccount.pubkey,
        transactionSigner,
      })
    },
    onError: () => {
      toastError('Failed to close stake account.')
    },
    onSuccess: async (signature) => {
      await invalidateStakeAccountQueries({ address, client, network, queryClient })
      toastSuccess(`Stake account closed: ${ellipsify(signature, 6, '...')}`)
    },
  })
}

export function useCloseStakeAccount({
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

  return useMutation(closeStakeAccountMutationOptions({ address, client, getTransactionSigner, network, queryClient }))
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
