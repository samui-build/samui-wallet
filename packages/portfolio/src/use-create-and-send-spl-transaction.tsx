import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { createAndSendSplTransaction } from '@workspace/solana-client/create-and-send-spl-transaction'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function useCreateAndSendSplTransaction(props: { cluster: Cluster }) {
  const { cluster } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ cluster })

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
    onSuccess: (_, { wallet: { publicKey: address } }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, cluster }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, cluster }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getTokenAccountsQueryOptions({ address, client, cluster }).queryKey,
      })
    },
  })
}
