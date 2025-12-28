import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { closeStakeAccount } from '@workspace/solana-client/close-stake-account'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getTransactionSigner } from './get-transaction-signer.ts'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { getStakeAccountsQueryOptions } from './use-get-stake-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function closeStakeAccountMutationOptions({
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
    mutationFn: async (stakeAccount: StakeAccount) => {
      const transactionSigner = await getTransactionSigner(account, readSecretKey)
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
      await invalidateStakeAccountQueries({ account, client, network, queryClient })
      toastSuccess(`Stake account closed: ${ellipsify(signature, 6, '...')}`)
    },
  })
}

export function useCloseStakeAccount({ account, network }: { account: Account; network: Network }) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()
  const readSecretKeyMutation = useAccountReadSecretKey()

  return useMutation(
    closeStakeAccountMutationOptions({
      account,
      client,
      network,
      queryClient,
      readSecretKey: readSecretKeyMutation.mutateAsync,
    }),
  )
}

async function invalidateStakeAccountQueries({
  account,
  client,
  queryClient,
  network,
}: {
  account: Account
  client: SolanaClient
  queryClient: QueryClient
  network: Network
}) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: getBalanceQueryOptions({ address: account.publicKey, client, network }).queryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: getStakeAccountsQueryOptions({ address: account.publicKey, client, network }).queryKey,
    }),
  ])
}
