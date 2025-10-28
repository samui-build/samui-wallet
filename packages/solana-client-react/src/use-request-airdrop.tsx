import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { address } from '@workspace/solana-client'
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
    mutationFn: async (wallet: Wallet) => {
      return requestAirdrop(client, address(wallet.publicKey))
    },
    onError: () => {
      toastError('Failed to request airdrop. Please try the faucet directly.')
    },
    onSuccess: (_, wallet) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ client, cluster, wallet }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ client, cluster, wallet }).queryKey,
      })

      toastSuccess('Airdrop requested successfully')
    },
  })
}
