import type { Signature } from '@solana/kit'
import { mutationOptions, useMutation } from '@tanstack/react-query'
import { tryCatch } from '@workspace/core/try-catch'
import type { Account } from '@workspace/db/account/account'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useAccountReadSecretKey } from '@workspace/db-react/use-account-read-secret-key'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useCreateAndSendSolTransaction } from './use-create-and-send-sol-transaction.tsx'
import { useCreateAndSendSplTransaction } from './use-create-and-send-spl-transaction.tsx'
import type { TokenBalance } from './use-get-token-metadata.ts'

export interface PortfolioTxSendInput {
  mint: TokenBalance
  recipients: TransferRecipient[]
}

export function portfolioTxSendMutationOptions({
  account,
  readSecretKeyMutation,
  sendSolMutation,
  sendSplMutation,
}: {
  account: Account
  readSecretKeyMutation: ReturnType<typeof useAccountReadSecretKey>
  sendSolMutation: ReturnType<typeof useCreateAndSendSolTransaction>
  sendSplMutation: ReturnType<typeof useCreateAndSendSplTransaction>
}) {
  async function handleSendSplToken(input: PortfolioTxSendInput): Promise<Signature | undefined> {
    const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'
    const secretKey = await readSecretKeyMutation.mutateAsync({ id: account.id })
    if (!secretKey) {
      throw new Error(`No secret key for this account`)
    }

    const transactionSigner = await createKeyPairSignerFromJson({ json: secretKey })
    // Send SPL token
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

  async function handleSendSol(input: PortfolioTxSendInput): Promise<Signature | undefined> {
    const secretKey = await readSecretKeyMutation.mutateAsync({ id: account.id })
    if (!secretKey) {
      throw new Error(`No secret key for this account`)
    }
    const sender = await createKeyPairSignerFromJson({ json: secretKey })
    const { data: result, error: sendError } = await tryCatch(
      sendSolMutation.mutateAsync({ recipients: input.recipients, sender }),
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
    mutationFn: (input: PortfolioTxSendInput) => {
      if (input.mint.mint === NATIVE_MINT) {
        return handleSendSol(input)
      }
      return handleSendSplToken(input)
    },
  })
}

export function usePortfolioTxSend() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const readSecretKeyMutation = useAccountReadSecretKey()
  const sendSolMutation = useCreateAndSendSolTransaction({ account, network })
  const sendSplMutation = useCreateAndSendSplTransaction({ network })

  return useMutation(
    portfolioTxSendMutationOptions({
      account,
      readSecretKeyMutation,
      sendSolMutation,
      sendSplMutation,
    }),
  )
}
