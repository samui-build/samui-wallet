import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import type { RequestAirdropOption } from '@workspace/solana-client/request-airdrop'
import { requestAirdrop } from '@workspace/solana-client/request-airdrop'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { UiToastLink } from '@workspace/ui/components/ui-toast-link'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { getAccountInfoQueryOptions } from './use-get-account-info.tsx'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function requestAirdropMutationOptions(client: SolanaClient, queryClient: QueryClient, network: Network) {
  return mutationOptions({
    mutationFn: (input: RequestAirdropOption) => requestAirdrop(client, input),
    onError: () => {
      toastError(
        network.type === 'solana:localnet' ? (
          'Failed to request airdrop. Make sure your local validator is running.'
        ) : (
          <UiToastLink
            href="https://faucet.solana.com/"
            label="Failed to request airdrop. Click here to try the faucet directly."
          />
        ),
      )
    },
    onSuccess: (_, { address }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })

      toastSuccess('Airdrop requested successfully')
    },
  })
}

export function useRequestAirdrop(network: Network) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()

  return useMutation(requestAirdropMutationOptions(client, queryClient, network))
}
