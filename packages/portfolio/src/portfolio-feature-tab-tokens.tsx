import { tryCatch } from '@workspace/core/try-catch'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { Spinner } from '@workspace/ui/components/spinner'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useCallback, useMemo } from 'react'
import type { TokenBalance } from './data-access/use-get-token-metadata.ts'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import type { ClusterWallet } from './portfolio-routes-loaded.tsx'
import { PortfolioUiRequestAirdrop } from './ui/portfolio-ui-request-airdrop.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'
import { PortfolioUiWalletButtons } from './ui/portfolio-ui-wallet-buttons.tsx'
import { useCreateAndSendSolTransaction } from './use-create-and-send-sol-transaction.tsx'
import { useCreateAndSendSplTransaction } from './use-create-and-send-spl-transaction.tsx'

interface SendTokenInput {
  amount: string
  destination: string
  mint: TokenBalance
}

export function PortfolioFeatureTabTokens(props: ClusterWallet) {
  const { cluster, wallet } = props
  const balances = useGetTokenBalances({ address: wallet.publicKey, cluster })
  const { data: dataAccountInfo, isLoading: isLoadingAccountInfo } = useGetAccountInfo({
    address: props.wallet.publicKey,
    cluster: props.cluster,
  })

  const sendSolMutation = useCreateAndSendSolTransaction(props)
  const sendSplMutation = useCreateAndSendSplTransaction(props)

  const totalBalance = useMemo(() => {
    const balance = balances.reduce((acc, item) => {
      if (!item.metadata?.usdPrice) {
        return acc
      }
      const itemBalance = (Number(item.balance) / 10 ** item.decimals) * item.metadata.usdPrice
      return acc + itemBalance
    }, 0)

    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(balance)
  }, [balances])

  const isLoading = sendSolMutation.isPending || sendSplMutation.isPending

  const handleSendSplToken = useCallback(
    async (input: SendTokenInput): Promise<void> => {
      const tokenSymbol = input.mint.metadata?.symbol ?? 'Token'

      // Send SPL token
      const { data: result, error: sendError } = await tryCatch(
        sendSplMutation.mutateAsync({
          ...input,
          decimals: input.mint.decimals,
          mint: input.mint.mint,
          wallet: wallet,
        }),
      )

      if (sendError) {
        toastError(`Error sending ${tokenSymbol}`)
        return
      }

      if (result) {
        toastSuccess(`${tokenSymbol} has been sent!`)
      } else {
        toastError(`Failed to send ${tokenSymbol}`)
      }
    },
    [wallet, sendSplMutation],
  )

  const handleSendSol = useCallback(
    async (input: SendTokenInput): Promise<void> => {
      const { data: result, error: sendError } = await tryCatch(
        sendSolMutation.mutateAsync({ ...input, wallet: wallet }),
      )

      if (sendError) {
        toastError('Error sending SOL')
        return
      }

      if (result) {
        toastSuccess('SOL has been sent!')
      } else {
        toastError('Failed to send SOL')
      }
    },
    [wallet, sendSolMutation],
  )

  const handleSendToken = useCallback(
    async (input: SendTokenInput): Promise<void> => {
      if (input.mint.mint !== NATIVE_MINT) {
        await handleSendSplToken(input)
      } else {
        await handleSendSol(input)
      }
    },
    [handleSendSol, handleSendSplToken],
  )
  if (isLoadingAccountInfo) {
    return <Spinner />
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-4xl font-bold text-center">$ {totalBalance}</div>
      <PortfolioUiWalletButtons balances={balances} {...props} isLoading={isLoading} send={handleSendToken} />
      <PortfolioUiRequestAirdrop cluster={cluster} lamports={dataAccountInfo?.value?.lamports} wallet={wallet} />
      <PortfolioUiTokenBalances items={balances} />
    </div>
  )
}
