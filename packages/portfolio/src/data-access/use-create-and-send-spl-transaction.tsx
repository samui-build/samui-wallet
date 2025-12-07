import { address, type TransactionSigner } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { createAndSendSplTransaction } from '@workspace/solana-client/create-and-send-spl-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function createAndSendSplTransactionMutationOptions(
  client: SolanaClient,
  queryClient: QueryClient,
  network: Network,
) {
  return mutationOptions({
    mutationFn: async ({
      amount,
      destination,
      mint,
      transactionSigner,
    }: {
      amount: string
      destination: string
      mint: string
      transactionSigner: TransactionSigner
    }) => {
      return createAndSendSplTransaction(client, {
        amount,
        destination: address(destination),
        mint: address(mint),
        transactionSigner,
      })
    },
    onSuccess: (_, { transactionSigner: { address } }) => {
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

export function useCreateAndSendSplTransaction({ network }: { network: Network }) {
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network })

  return useMutation(createAndSendSplTransactionMutationOptions(client, queryClient, network))
}
