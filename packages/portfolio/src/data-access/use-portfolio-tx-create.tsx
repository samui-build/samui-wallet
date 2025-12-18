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
import { useCreateSolTransaction } from './use-create-sol-transaction.tsx'
import { useCreateSplTransaction } from './use-create-spl-transaction.tsx'
import type { TokenBalance } from './use-get-token-metadata.ts'

export interface PortfolioTxCreateInput {
  mint: TokenBalance
  recipients: TransferRecipient[]
}

export function portfolioTxCreateMutationOptions({
  account,
  readSecretKeyMutation,
  createSolMutation,
  createSplMutation,
}: {
  account: Account
  readSecretKeyMutation: ReturnType<typeof useAccountReadSecretKey>
  createSolMutation: ReturnType<typeof useCreateSolTransaction>
  createSplMutation: ReturnType<typeof useCreateSplTransaction>
}) {
  async function handleSendSplToken(input: PortfolioTxCreateInput) {
    const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'
    const secretKey = await readSecretKeyMutation.mutateAsync({ id: account.id })
    if (!secretKey) {
      throw new Error(`No secret key for this account`)
    }

    const transactionSigner = await createKeyPairSignerFromJson({ json: secretKey })
    const { data: result, error: sendError } = await tryCatch(
      createSplMutation.mutateAsync({ mint: input.mint.mint, recipients: input.recipients, transactionSigner }),
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

  async function handleSendSol(input: PortfolioTxCreateInput) {
    const secretKey = await readSecretKeyMutation.mutateAsync({ id: account.id })
    if (!secretKey) {
      throw new Error(`No secret key for this account`)
    }
    const sender = await createKeyPairSignerFromJson({ json: secretKey })
    const { data: result, error: sendError } = await tryCatch(
      createSolMutation.mutateAsync({ recipients: input.recipients, sender }),
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
    mutationFn: (input: PortfolioTxCreateInput) => {
      if (input.mint.mint === NATIVE_MINT) {
        return handleSendSol(input)
      }
      return handleSendSplToken(input)
    },
  })
}

export function usePortfolioTxCreate() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const readSecretKeyMutation = useAccountReadSecretKey()
  const createSolMutation = useCreateSolTransaction({ network })
  const createSplMutation = useCreateSplTransaction({ network })

  return useMutation(
    portfolioTxCreateMutationOptions({
      account,
      createSolMutation,
      createSplMutation,
      readSecretKeyMutation,
    }),
  )
}
