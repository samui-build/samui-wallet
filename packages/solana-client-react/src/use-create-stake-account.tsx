import type { Address, Lamports } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { createStakeAccount } from '@workspace/solana-client/create-stake-account'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getTransactionSigner } from './get-transaction-signer.ts'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { getStakeAccountsQueryOptions } from './use-get-stake-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export interface CreateStakeAccountInput {
  amount: Lamports
  vote: Address
}

export function createStakeAccountMutationOptions({
  account,
  client,
  queryClient,
  readSecretKey,
  network,
}: {
  account: Account
  client: SolanaClient
  queryClient: QueryClient
  readSecretKey: (input: { id: string }) => Promise<string | undefined>
  network: Network
}) {
  return mutationOptions({
    mutationFn: async ({ amount, vote }: CreateStakeAccountInput) => {
      const transactionSigner = await getTransactionSigner(account, readSecretKey)
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
      await invalidateStakeAccountQueries({ address: account.publicKey, client, network, queryClient })
      toastSuccess(`Stake transaction confirmed: ${ellipsify(signature, 6, '...')}`)
    },
  })
}

export function useCreateStakeAccount({ account, network }: { account: Account; network: Network }) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()
  const readSecretKeyMutation = useAccountReadSecretKey()

  return useMutation(
    createStakeAccountMutationOptions({
      account,
      client,
      network,
      queryClient,
      readSecretKey: readSecretKeyMutation.mutateAsync,
    }),
  )
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
