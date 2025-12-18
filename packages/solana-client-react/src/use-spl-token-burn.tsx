import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { SplTokenBurnOptions } from '@workspace/solana-client/spl-token-burn'
import { splTokenBurn } from '@workspace/solana-client/spl-token-burn'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getAccountInfoQueryOptions } from './use-get-account-info.tsx'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { getTokenAccountInfoQueryOptions } from './use-get-token-account-info.tsx'
import { getTokenAccountsQueryOptions } from './use-get-token-accounts.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function splTokenBurnMutationOptions(client: SolanaClient, queryClient: QueryClient, network: Network) {
  return mutationOptions({
    mutationFn: async (input: SplTokenBurnOptions) => {
      return splTokenBurn(client, input)
    },
    onError: () => {
      toastError('Failed to burn token.')
    },
    onSuccess: (_, { account, transactionSigner: { address } }) => {
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getTokenAccountInfoQueryOptions({ address: account, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getTokenAccountsQueryOptions({ address, client, network }).queryKey,
      })
      toastSuccess('Token burned successfully')
    },
  })
}

export function useSplTokenBurn(props: { network: Network }) {
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network: props.network })

  return useMutation(splTokenBurnMutationOptions(client, queryClient, props.network))
}
