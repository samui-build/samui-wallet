import { address, type KeyPairSigner } from '@solana/kit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'
import { getBalance } from '@workspace/solana-client/get-balance'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function useCreateAndSendSolTransaction({ account, network }: { account: Account; network: Network }) {
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network })

  return useMutation({
    mutationFn: async ({
      amount,
      destination,
      sender,
    }: {
      amount: string
      destination: string
      sender: KeyPairSigner
    }) => {
      const senderBalance = await getBalance(client, { address: sender.address })
      if (!senderBalance?.value) {
        throw new Error('Balance not available')
      }
      return createAndSendSolTransaction(client, {
        amount: solToLamports(amount),
        destination: address(destination),
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
