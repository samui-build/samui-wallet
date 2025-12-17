import type { KeyPairSigner } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'
import { getBalance } from '@workspace/solana-client/get-balance'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function createAndSendSolTransactionMutationOptions(
  client: SolanaClient,
  queryClient: QueryClient,
  account: Account,
  network: Network,
) {
  return mutationOptions({
    mutationFn: async ({ recipients, sender }: { recipients: TransferRecipient[]; sender: KeyPairSigner }) => {
      const senderBalance = await getBalance(client, { address: sender.address })
      if (!senderBalance?.value) {
        throw new Error('Balance not available')
      }
      return createAndSendSolTransaction(client, {
        recipients,
        senderBalance: senderBalance.value,
        transactionSigner: sender,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address: account.publicKey, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address: account.publicKey, client, network }).queryKey,
      })
    },
  })
}

export function useCreateAndSendSolTransaction({ account, network }: { account: Account; network: Network }) {
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network })

  return useMutation(createAndSendSolTransactionMutationOptions(client, queryClient, account, network))
}
