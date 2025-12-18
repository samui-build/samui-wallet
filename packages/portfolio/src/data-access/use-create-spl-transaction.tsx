import { address, type TransactionSigner } from '@solana/kit'
import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { createSplTransaction } from '@workspace/solana-client/create-spl-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function createSplTransactionMutationOptions(client: SolanaClient) {
  return mutationOptions({
    mutationFn: async ({
      mint,
      recipients,
      transactionSigner,
    }: {
      mint: string
      recipients: TransferRecipient[]
      transactionSigner: TransactionSigner
    }) => {
      return createSplTransaction(client, {
        mint: address(mint),
        recipients,
        transactionSigner,
      })
    },
  })
}

export function useCreateSplTransaction({ network }: { network: Network }) {
  const client = useSolanaClient({ network })

  return useMutation(createSplTransactionMutationOptions(client))
}
