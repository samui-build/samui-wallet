import type { Cluster } from '@workspace/db/entity/cluster'
import type { RequestAirdropOption } from '@workspace/solana-client/request-airdrop'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestAirdrop } from '@workspace/solana-client/request-airdrop'

import { toastError } from '../../ui/src/lib/toast-error'
import { toastSuccess } from '../../ui/src/lib/toast-success'
import { getAccountInfoQueryOptions } from './use-get-account-info'
import { getBalanceQueryOptions } from './use-get-balance'
import { useSolanaClient } from './use-solana-client'

export function useRequestAirdrop(cluster: Cluster) {
  const client = useSolanaClient({ cluster })
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
        queryKey: getBalanceQueryOptions({ address, client, cluster }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, cluster }).queryKey,
      })

      toastSuccess('Airdrop requested successfully')
    },
  })
}
