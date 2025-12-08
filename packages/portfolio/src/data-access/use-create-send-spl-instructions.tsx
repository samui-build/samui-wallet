import { address, type KeyPairSigner } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { createSplTransferInstructions } from '@workspace/solana-client/create-spl-transfer-instructions'

export function useCreateSendSplInstructions() {
  return useMutation({
    mutationFn: async ({
      amount,
      decimals,
      destination,
      feePayerSigner,
      mint,
    }: {
      amount: string
      decimals: number
      destination: string
      feePayerSigner: KeyPairSigner
      mint: string
    }) => {
      return createSplTransferInstructions({
        amount,
        decimals,
        destination: address(destination),
        feePayerSigner,
        mint: address(mint),
      })
    },
  })
}
