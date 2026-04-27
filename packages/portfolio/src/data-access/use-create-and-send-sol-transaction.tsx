import type { Address, TransactionSigner } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'
import { getBalance } from '@workspace/solana-client/get-balance'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

function createAndSendSolTransactionMutationOptions({
  address,
  client,
  network,
  queryClient,
}: {
  address: Address
  client: SolanaClient
  network: Network
  queryClient: QueryClient
}) {
  return mutationOptions({
    mutationFn: async ({
      recipients,
      transactionSigner,
    }: {
      recipients: TransferRecipient[]
      transactionSigner: TransactionSigner
    }) => {
      const senderBalance = await getBalance(client, { address: transactionSigner.address })
      if (!senderBalance?.value) {
        throw new Error('Balance not available')
      }
      return createAndSendSolTransaction(client, {
        recipients,
        senderBalance: senderBalance.value,
        transactionSigner,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })
    },
  })
}

export function useCreateAndSendSolTransaction({ address, network }: { address: Address; network: Network }) {
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network })

  return useMutation(createAndSendSolTransactionMutationOptions({ address, client, network, queryClient }))
}
