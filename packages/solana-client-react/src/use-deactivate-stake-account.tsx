import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { deactivateStakeAccount } from '@workspace/solana-client/deactivate-stake-account'
import type { StakeAccount } from '@workspace/solana-client/get-stake-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getTransactionSigner } from './get-transaction-signer.ts'
import { getStakeAccountsQueryOptions } from './use-get-stake-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function deactivateStakeAccountMutationOptions({
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
        queryKey: getStakeAccountsQueryOptions({ address: account.publicKey, client, network }).queryKey,
      })
      toastSuccess(`Stake account deactivated: ${ellipsify(signature, 6, '...')}`)
    },
  })
}

export function useDeactivateStakeAccount({ account, network }: { account: Account; network: Network }) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()
  const readSecretKeyMutation = useAccountReadSecretKey()

  return useMutation(
    deactivateStakeAccountMutationOptions({
      account,
      client,
      network,
      queryClient,
      readSecretKey: readSecretKeyMutation.mutateAsync,
    }),
  )
}
