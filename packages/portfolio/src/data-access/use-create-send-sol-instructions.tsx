import { useMutation } from '@tanstack/react-query'
import {
  type CreateSolTransferTransactionOptions,
  createSolTransferInstructions,
} from '@workspace/solana-client/create-sol-transfer-instructions'

export function useCreateSendSolInstructions() {
  return useMutation({
    mutationFn: async ({ amount, destination, source }: CreateSolTransferTransactionOptions) => {
      return createSolTransferInstructions({ amount, destination, source })
    },
  })
}
