import { address, type Instruction } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { tryCatch } from '@workspace/core/try-catch'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useActiveAccountSecretKey } from './use-active-account-secret-key.tsx'
import { useCreateSendSolInstructions } from './use-create-send-sol-instructions.tsx'
import { useCreateSendSplInstructions } from './use-create-send-spl-instructions.tsx'
import type { TokenBalance } from './use-get-token-metadata.ts'

export interface PortfolioTxPreviewInput {
  amount: string
  destination: string
  mint: TokenBalance
}

export function usePortfolioTxPreview() {
  const activeAccountFeePayerSigner = useActiveAccountSecretKey()
  const createSendSolInstructionMutation = useCreateSendSolInstructions()
  const createSendSplInstructionMutation = useCreateSendSplInstructions()

  async function handleSendSplToken(input: PortfolioTxPreviewInput): Promise<Instruction[] | undefined> {
    const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'
    const feePayerSigner = await activeAccountFeePayerSigner()
    // Send SPL token
    const { data: result, error: sendError } = await tryCatch(
      createSendSplInstructionMutation.mutateAsync({
        ...input,
        decimals: input.mint.decimals,
        feePayerSigner,
        mint: input.mint.mint,
      }),
    )

    if (sendError) {
      toastError(`Error sending ${tokenSymbol}`)
      return
    }

    if (result) {
      toastSuccess(`${tokenSymbol} has been sent!`)
      return result
    }
    toastError(`Failed to send ${tokenSymbol}`)
    return
  }

  async function handleSendSol(input: PortfolioTxPreviewInput): Promise<Instruction[] | undefined> {
    const source = await activeAccountFeePayerSigner()
    const { data: result, error: sendError } = await tryCatch(
      createSendSolInstructionMutation.mutateAsync({
        amount: solToLamports(input.amount),
        destination: address(input.destination),
        source,
      }),
    )

    if (sendError) {
      toastError(`Error sending SOL: ${sendError}`)
      return
    }

    if (result) {
      toastSuccess('SOL has been sent!')
      return result
    }
    toastError('Failed to send SOL')
    return
  }

  return useMutation({
    mutationFn: (input: PortfolioTxPreviewInput) => {
      if (input.mint.mint === NATIVE_MINT) {
        return handleSendSol(input)
      }
      return handleSendSplToken(input)
    },
  })
}
