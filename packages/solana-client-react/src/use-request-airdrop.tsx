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
      toastError('Failed to request airdrop. Please try the faucet directly.')
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
