import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Wallet } from '@workspace/db/entity/wallet'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions, useGetBalance } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

import type { ClusterWallet } from './portfolio-routes-loaded.tsx'

export function useCreateAndSendSolTransaction(props: ClusterWallet) {
  const { cluster, wallet } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ cluster: props.cluster })
  const { data: balanceData } = useGetBalance({ address: wallet.publicKey, cluster })

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
        amount: solToLamports(amount),
        destination,
        sender,
        senderBalance: balanceData.value,
      })
    },
    onSuccess: (_, { wallet: { publicKey: address } }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, cluster }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, cluster }).queryKey,
      })
    },
  })
}
