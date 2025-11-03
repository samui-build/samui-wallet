import type { Wallet } from '@workspace/db/entity/wallet'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions, useGetBalance } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'

import type { ClusterWallet } from './portfolio-routes-loaded.js'

export function useCreateAndSendSolTransaction(props: ClusterWallet) {
  const { cluster, wallet } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ cluster: props.cluster })
  const { data: balanceData } = useGetBalance({ cluster, wallet })

  return useMutation({
    mutationFn: async ({ amount, destination, wallet }: { amount: string; destination: string; wallet: Wallet }) => {
      if (!wallet.secretKey) {
        throw new Error(`No secret key for this wallet`)
      }

      const sender = await createKeyPairSignerFromJson({ json: wallet.secretKey })

      if (!balanceData?.value) {
        throw new Error('Balance not available')
      }

      return createAndSendSolTransaction(client, {
        amount: BigInt(amount),
        destination,
        sender,
        senderBalance: balanceData.value,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ client, cluster, wallet }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ client, cluster, wallet }).queryKey,
      })
    },
  })
}
