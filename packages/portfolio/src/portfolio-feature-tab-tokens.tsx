import { tryCatch } from '@workspace/core/try-catch'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useCallback, useMemo } from 'react'
import { useCreateAndSendSolTransaction } from './data-access/use-create-and-send-sol-transaction.tsx'
import { useCreateAndSendSplTransaction } from './data-access/use-create-and-send-spl-transaction.tsx'
import type { TokenBalance } from './data-access/use-get-token-metadata.ts'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import { PortfolioUiAccountButtons } from './ui/portfolio-ui-account-buttons.tsx'
import { PortfolioUiBalance } from './ui/portfolio-ui-balance.tsx'
import { PortfolioUiBalanceSkeleton } from './ui/portfolio-ui-balance-skeleton.tsx'
import { PortfolioUiRequestAirdrop } from './ui/portfolio-ui-request-airdrop.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'
import { PortfolioUiTokenBalancesSkeleton } from './ui/portfolio-ui-token-balances-skeleton.tsx'

interface SendTokenInput {
  amount: string
  destination: string
  mint: TokenBalance
}

export function PortfolioFeatureTabTokens() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const balances = useGetTokenBalances({ address: account.publicKey, network })
  const { data: dataWalletInfo, isLoading: isLoadingWalletInfo } = useGetAccountInfo({
    address: account.publicKey,
    network,
  })

  const sendSolMutation = useCreateAndSendSolTransaction({ account, network })
  const sendSplMutation = useCreateAndSendSplTransaction({ network })

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
      minimumFractionDigits: 2,
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
          account: account,
          decimals: input.mint.decimals,
          mint: input.mint.mint,
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
    [account, sendSplMutation],
  )

  const handleSendSol = useCallback(
    async (input: SendTokenInput): Promise<void> => {
      const { data: result, error: sendError } = await tryCatch(
        sendSolMutation.mutateAsync({ ...input, account: account }),
      )

      if (sendError) {
        toastError(`Error sending SOL: ${sendError}`)
        return
      }

      if (result) {
        toastSuccess('SOL has been sent!')
      } else {
        toastError('Failed to send SOL')
      }
    },
    [account, sendSolMutation],
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

  return (
    <div className="space-y-6">
      {isLoadingWalletInfo ? <PortfolioUiBalanceSkeleton /> : <PortfolioUiBalance balance={totalBalance} />}

      <PortfolioUiAccountButtons
        account={account}
        balances={balances}
        isLoading={isLoading}
        network={network}
        send={handleSendToken}
      />

      {isLoadingWalletInfo ? null : (
        <PortfolioUiRequestAirdrop account={account} lamports={dataWalletInfo?.value?.lamports} network={network} />
      )}

      {isLoadingWalletInfo ? (
        <PortfolioUiTokenBalancesSkeleton length={3} />
      ) : (
        <PortfolioUiTokenBalances items={balances} />
      )}
    </div>
  )
}
