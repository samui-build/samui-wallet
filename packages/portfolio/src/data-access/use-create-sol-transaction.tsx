import type { KeyPairSigner } from '@solana/kit'
import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { createSolTransaction } from '@workspace/solana-client/create-sol-transaction'
import { getBalance } from '@workspace/solana-client/get-balance'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function createSolTransactionMutationOptions(client: SolanaClient) {
  return mutationOptions({
    mutationFn: async ({ recipients, sender }: { recipients: TransferRecipient[]; sender: KeyPairSigner }) => {
      const senderBalance = await getBalance(client, { address: sender.address })
      if (!senderBalance?.value) {
        throw new Error('Balance not available')
      }
      return createSolTransaction(client, {
        recipients,
        senderBalance: senderBalance.value,
        transactionSigner: sender,
      })
    },
  })
}

export function useCreateSolTransaction({ network }: { network: Network }) {
  const client = useSolanaClient({ network })

  return useMutation(createSolTransactionMutationOptions(client))
}
