import type { KeyPairSigner, Signature } from '@solana/kit'
import { mutationOptions, useMutation } from '@tanstack/react-query'
import { tryCatch } from '@workspace/core/try-catch'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useCreateAndSendSolTransaction } from './use-create-and-send-sol-transaction.tsx'
import { useCreateAndSendSplTransaction } from './use-create-and-send-spl-transaction.tsx'
import { useGetActiveAccountKeyPairSigner } from './use-get-active-account-key-pair-signer.tsx'
import type { TokenBalance } from './use-get-token-metadata.ts'

export interface PortfolioTxSendInput {
  mint: TokenBalance
  recipients: TransferRecipient[]
}

export function portfolioTxSendMutationOptions({
  sendSolMutation,
  sendSplMutation,
}: {
  sendSolMutation: ReturnType<typeof useCreateAndSendSolTransaction>
  sendSplMutation: ReturnType<typeof useCreateAndSendSplTransaction>
}) {
  const getActiveAccountKeyPairSigner = useGetActiveAccountKeyPairSigner()
  async function handleSendSplToken(
    input: PortfolioTxSendInput,
    transactionSigner: KeyPairSigner,
  ): Promise<Signature | undefined> {
    const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'
    const { data: result, error: sendError } = await tryCatch(
      sendSplMutation.mutateAsync({ mint: input.mint.mint, recipients: input.recipients, transactionSigner }),
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

  async function handleSendSol(
    input: PortfolioTxSendInput,
    transactionSigner: KeyPairSigner,
  ): Promise<Signature | undefined> {
    const { data: result, error: sendError } = await tryCatch(
      sendSolMutation.mutateAsync({ recipients: input.recipients, transactionSigner }),
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

  return mutationOptions({
    mutationFn: async (input: PortfolioTxSendInput) => {
      const transactionSigner = await getActiveAccountKeyPairSigner()
      if (input.mint.mint === NATIVE_MINT) {
        return handleSendSol(input, transactionSigner)
      }
      return handleSendSplToken(input, transactionSigner)
    },
  })
}

export function usePortfolioTxSend() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const sendSolMutation = useCreateAndSendSolTransaction({ account, network })
  const sendSplMutation = useCreateAndSendSplTransaction({ network })

  return useMutation(
    portfolioTxSendMutationOptions({
      sendSolMutation,
      sendSplMutation,
    }),
  )
}
