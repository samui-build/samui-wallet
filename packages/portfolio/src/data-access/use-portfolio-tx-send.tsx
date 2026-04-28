import type { Signature } from '@solana/kit'
import { mutationOptions, type QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { tryCatch } from '@workspace/core/try-catch'
import type { Network } from '@workspace/db/network/network'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { sendPreparedTransaction } from '@workspace/solana-client/send-prepared-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import type { PortfolioPreparedTransaction } from './use-portfolio-tx-prepare.tsx'

export type PortfolioTxSendInput = PortfolioPreparedTransaction

export function portfolioTxSendMutationOptions({
  client,
  network,
  queryClient,
}: {
  client: SolanaClient
  network: Network
  queryClient: QueryClient
}) {
  async function handleSendSplToken(input: PortfolioTxSendInput): Promise<Signature | undefined> {
    const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'
    const { data: result, error: sendError } = await tryCatch(sendPreparedTransaction(client, input))

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
    const { data: result, error: sendError } = await tryCatch(sendPreparedTransaction(client, input))

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
      if (input.mint.mint === NATIVE_MINT) {
        return handleSendSol(input)
      }
      return handleSendSplToken(input)
    },
    onSuccess: (_, { mint, transactionSigner: { address } }) => {
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
