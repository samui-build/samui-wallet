import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { Spinner } from '@workspace/ui/components/spinner'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useMemo } from 'react'

import type { ClusterWallet } from './portfolio-routes-loaded.js'

import { useGetTokenBalances } from './data-access/use-get-token-metadata.js'
import { PortfolioUiRequestAirdrop } from './ui/portfolio-ui-request-airdrop.js'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.js'
import { PortfolioUiWalletButtons } from './ui/portfolio-ui-wallet-buttons.js'
import { useCreateAndSendSolTransaction } from './use-create-and-send-sol-transaction.js'
import { useCreateAndSendSplTransaction } from './use-create-and-send-spl-transaction.js'

export function PortfolioFeatureTabTokens(props: ClusterWallet) {
  const balances = useGetTokenBalances(props)
  const { data: dataAccountInfo, isLoading: isLoadingAccountInfo } = useGetAccountInfo(props)

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

  if (isLoadingAccountInfo) {
    return <Spinner />
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-4xl font-bold text-center">$ {totalBalance}</div>
      <PortfolioUiWalletButtons
        balances={balances}
        {...props}
        isLoading={isLoadingAccountInfo}
        send={async (input) => {
          if (input.mint.mint !== 'So11111111111111111111111111111111111111112') {
            const done = await sendSplMutation.mutateAsync({
              ...input,
              decimals: input.mint.decimals,
              mint: input.mint.mint,
              wallet: props.wallet,
            })
            if (done) {
              toastSuccess(`${input.mint.metadata?.symbol ?? 'Token'} has been sent!`)
            } else {
              toastError(`Error sending ${input.mint.metadata?.symbol ?? 'token'}`)
            }
            return
          }
          const done = await sendSolMutation.mutateAsync({ ...input, wallet: props.wallet })
          if (done) {
            toastSuccess('Sol has been sent!')
          } else {
            toastError(`Error sending SOL`)
          }
        }}
      />
      <PortfolioUiRequestAirdrop
        cluster={props.cluster}
        lamports={dataAccountInfo?.value?.lamports}
        wallet={props.wallet}
      />
      <PortfolioUiTokenBalances items={balances} />
    </div>
  )
}
