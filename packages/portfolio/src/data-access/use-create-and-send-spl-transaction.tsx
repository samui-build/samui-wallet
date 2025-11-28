import type { KeyPairSigner } from '@solana/kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { createAndSendSplTransaction } from '@workspace/solana-client/create-and-send-spl-transaction'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function useCreateAndSendSplTransaction({ network }: { network: Network }) {
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network })

  return useMutation({
    mutationFn: async ({
      amount,
      decimals,
      destination,
      mint,
      sender,
    }: {
      amount: string
      decimals: number
      destination: string
      mint: string
      sender: KeyPairSigner
    }) => {
      return createAndSendSplTransaction(client, { amount, decimals, destination, mint, sender })
    },
    onSuccess: (_, { sender: { address } }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getTokenAccountsQueryOptions({ address, client, network }).queryKey,
      })
    },
  })
}
