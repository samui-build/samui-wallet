import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/entity/network'
import type { RequestAirdropOption } from '@workspace/solana-client/request-airdrop'
import { requestAirdrop } from '@workspace/solana-client/request-airdrop'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

import { getAccountInfoQueryOptions } from './use-get-account-info.tsx'
import { getBalanceQueryOptions } from './use-get-balance.tsx'
import { useSolanaClient } from './use-solana-client.tsx'

export function useRequestAirdrop(network: Network) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<RequestAirdropOption, 'client'>) => {
      return requestAirdrop({ ...input, client })
    },
    onError: () => {
      toastError(
        <a
          className="block cursor-pointer underline hover:no-underline"
          href="https://faucet.solana.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Failed to request airdrop. Click here to try the faucet directly.
        </a>,
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
