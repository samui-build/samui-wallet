import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { tryCatch } from '@workspace/core/try-catch'
import type { Network } from '@workspace/db/network/network'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import {
  type SendSimulatedPreparedTransactionResult,
  sendSimulatedPreparedTransaction,
} from '@workspace/solana-client/send-prepared-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import type { PortfolioPreparedTransaction } from './use-portfolio-tx-prepare.tsx'

export type PortfolioTxSendInput = PortfolioPreparedTransaction
export type PortfolioTxSendResult = SendSimulatedPreparedTransactionResult | undefined

export function portfolioTxSendMutationOptions({
  client,
  network,
  queryClient,
}: {
  client: SolanaClient
  network: Network
  queryClient: QueryClient
}) {
  async function handleSendSplToken(input: PortfolioTxSendInput): Promise<PortfolioTxSendResult> {
    const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'
    const { data: result, error: sendError } = await tryCatch(sendSimulatedPreparedTransaction(client, input))

    if (sendError) {
      toastError(`Error sending ${tokenSymbol}`)
      return
    }

    if (result?.signature) {
      toastSuccess(`${tokenSymbol} has been sent!`)
      return result
    }
    if (result?.simulation.status === 'failure') {
      toastError(`${tokenSymbol} simulation failed`)
      return result
    }
    toastError(`Failed to send ${tokenSymbol}`)
    return
  }

  async function handleSendSol(input: PortfolioTxSendInput): Promise<PortfolioTxSendResult> {
    const { data: result, error: sendError } = await tryCatch(sendSimulatedPreparedTransaction(client, input))

    if (sendError) {
      toastError(`Error sending SOL: ${sendError}`)
      return
    }

    if (result?.signature) {
      toastSuccess('SOL has been sent!')
      return result
    }
    if (result?.simulation.status === 'failure') {
      toastError('SOL simulation failed')
      return result
    }
    toastError('Failed to send SOL')
    return
  }

  return mutationOptions({
    mutationFn: async (input: PortfolioTxSendInput) => {
      if (input.mint.mint === NATIVE_MINT) {
        return handleSendSol(input)
      }
      return handleSendSplToken(input)
    },
    onSuccess: (result, { mint, transactionSigner: { address } }) => {
      if (!result?.signature) {
        return
      }

      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })
      if (mint.mint !== NATIVE_MINT) {
        queryClient.invalidateQueries({
          queryKey: getTokenAccountsQueryOptions({ address, client, network }).queryKey,
        })
      }
    },
  })
}

export function usePortfolioTxSend({ network }: { network: Network }) {
  const client = useSolanaClient({ network })
  const queryClient = useQueryClient()

  return useMutation(
    portfolioTxSendMutationOptions({
      client,
      network,
      queryClient,
    }),
  )
}
