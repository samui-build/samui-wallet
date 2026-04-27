import type { Address } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { deactivateStakeAccount } from '@workspace/solana-client/deactivate-stake-account'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getStakeAccountsQueryOptions } from './use-get-stake-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function deactivateStakeAccountMutationOptions({
  address,
  client,
  getTransactionSigner,
  network,
  queryClient,
}: {
  address: Address
  client: SolanaClient
  network: Network
  getTransactionSigner: GetTransactionSigner
  queryClient: QueryClient
}) {
  return mutationOptions({
    mutationFn: async (stakeAccount: StakeAccount) => {
      const transactionSigner = await getTransactionSigner()
      return deactivateStakeAccount(client, {
        stake: stakeAccount.pubkey,
        transactionSigner,
      })
    },
    onError: () => {
      toastError('Failed to unstake account.')
    },
    onSuccess: async (signature) => {
      await queryClient.invalidateQueries({
        queryKey: getStakeAccountsQueryOptions({ address, client, network }).queryKey,
      })
      toastSuccess(`Stake account deactivated: ${ellipsify(signature, 6, '...')}`)
    },
  })
}

export function useDeactivateStakeAccount({
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

  return useMutation(
    deactivateStakeAccountMutationOptions({
      address,
      client,
      getTransactionSigner,
      network,
      queryClient,
    }),
  )
}
