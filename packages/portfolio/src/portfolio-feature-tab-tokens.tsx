import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { Spinner } from '@workspace/ui/components/spinner'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Effect } from 'effect'
import { useCallback, useMemo } from 'react'
import type { TokenBalance } from './data-access/use-get-token-metadata.ts'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import type { AccountNetwork } from './portfolio-routes-loaded.tsx'
import { PortfolioUiAccountButtons } from './ui/portfolio-ui-account-buttons.tsx'
import { PortfolioUiRequestAirdrop } from './ui/portfolio-ui-request-airdrop.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'
import { useCreateAndSendSolTransaction } from './use-create-and-send-sol-transaction.tsx'
import { useCreateAndSendSplTransaction } from './use-create-and-send-spl-transaction.tsx'

interface SendTokenInput {
  amount: string
  destination: string
  mint: TokenBalance
}

export function PortfolioFeatureTabTokens(props: AccountNetwork) {
  const { account, network } = props
  const balances = useGetTokenBalances({ address: account.publicKey, network })
  const { data: dataWalletInfo, isLoading: isLoadingWalletInfo } = useGetAccountInfo({
    address: props.account.publicKey,
    network: props.network,
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
      const sendEffect = Effect.tryPromise({
        catch: (error) => new Error(`Error sending ${tokenSymbol}: ${error}`),
        try: () =>
          sendSplMutation.mutateAsync({
            ...input,
            account: account,
            decimals: input.mint.decimals,
            mint: input.mint.mint,
          }),
      }).pipe(
        Effect.flatMap((result) =>
          result
            ? Effect.sync(() => toastSuccess(`${tokenSymbol} has been sent!`))
            : Effect.sync(() => toastError(`Failed to send ${tokenSymbol}`)),
        ),
        Effect.catchAll(() => Effect.sync(() => toastError(`Error sending ${tokenSymbol}`))),
      )
      await Effect.runPromise(sendEffect)
    },
    [account, sendSplMutation],
  )

  const handleSendSol = useCallback(
    async (input: SendTokenInput): Promise<void> => {
      const sendEffect = Effect.tryPromise({
        catch: (error) => {
          return Effect.fail(error)
        },
        try: () => sendSolMutation.mutateAsync({ ...input, account: account }),
      }).pipe(
        Effect.flatMap((result) =>
          result
            ? Effect.sync(() => toastSuccess('SOL has been sent!'))
            : Effect.sync(() => toastError('Failed to send SOL')),
        ),
        Effect.catchAll(() => Effect.sync(() => toastError('Error sending SOL'))),
      )
      await Effect.runPromise(sendEffect)
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
  if (isLoadingWalletInfo) {
    return <Spinner />
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-4xl font-bold text-center">$ {totalBalance}</div>
      <PortfolioUiAccountButtons balances={balances} {...props} isLoading={isLoading} send={handleSendToken} />
      <PortfolioUiRequestAirdrop account={account} lamports={dataWalletInfo?.value?.lamports} network={network} />
      <PortfolioUiTokenBalances items={balances} />
    </div>
  )
}
