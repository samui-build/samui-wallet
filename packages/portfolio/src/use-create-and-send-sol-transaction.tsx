import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Wallet } from '@workspace/db/entity/wallet'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

import type { ClusterWallet } from './portfolio-routes-loaded.tsx'

export function useCreateAndSendSolTransaction(props: ClusterWallet) {
  const { cluster } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ cluster })

  return useMutation({
    mutationFn: async ({ amount, destination, wallet }: { amount: string; destination: string; wallet: Wallet }) => {
      if (!wallet.secretKey) {
        throw new Error(`No secret key for this wallet`)
      }
      const sender = await createKeyPairSignerFromJson({ json: wallet.secretKey })

      return createAndSendSolTransaction(client, { amount, destination, sender })
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
