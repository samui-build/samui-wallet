import type { Wallet } from '@workspace/db/entity/wallet'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import { createAndSendSplTransaction } from '@workspace/solana-client/create-and-send-spl-transaction'

import type { ClusterWallet } from './portfolio-routes-loaded.js'

export function useCreateAndSendSplTransaction(props: ClusterWallet) {
  const { cluster, wallet } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ cluster: props.cluster })

  return useMutation({
    mutationFn: async ({
      amount,
      decimals,
      destination,
      mint,
      wallet,
    }: {
      amount: string
      decimals: number
      destination: string
      mint: string
      wallet: Wallet
    }) => {
      if (!wallet.secretKey) {
        throw new Error(`No secret key for this wallet`)
      }
      const sender = await createKeyPairSignerFromJson({ json: wallet.secretKey })

      return createAndSendSplTransaction(client, { amount, decimals, destination, mint, sender })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ client, cluster, wallet }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ client, cluster, wallet }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getTokenAccountsQueryOptions({ client, cluster, wallet }).queryKey,
      })
    },
  })
}
