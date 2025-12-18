import { type Address, isAddress } from '@solana/kit'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useTranslation } from '@workspace/i18n'
import { uiAmountToBigInt } from '@workspace/solana-client/ui-amount-to-big-int'
import { useGetTokenAccountInfo } from '@workspace/solana-client-react/use-get-token-account-info'
import { useSplTokenBurn } from '@workspace/solana-client-react/use-spl-token-burn'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useNavigate, useParams } from 'react-router'
import { PortfolioUiBurn } from './ui/portfolio-ui-burn.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { useGetTransactionSigner } from './use-get-transaction-signer.tsx'

export function PortfolioFeatureModalBurn() {
  const { t } = useTranslation('portfolio')
  const { address } = useParams<{ address: string }>()
  const account = useAccountActive()
  const network = useNetworkActive()
  // const navigate = useNavigate()
  // const mutation = useSplTokenBurn({ network })
  // if (!token) {
  //   return <UiError message={new Error('Token parameter is unknown')} title="No token" />
  // }
  //
  // if (!mint) {
  //   return <UiError message={new Error(`Token with mint ${ellipsify(token)} not found`)} title="Token not found" />
  // }
  //
  // if (!amount) {
  //   return <UiError message={new Error('Parameter amount is unknown')} title="No amount" />
  // }

  if (!address || !isAddress(address)) {
    return <UiError message={new Error('Parameter address is unknown')} title="No address" />
  }

  return (
    <PortfolioUiModal title={t(($) => $.actionBurn)}>
      <PortfolioFeatureBurn account={account} address={address} network={network} />
    </PortfolioUiModal>
  )
}

function PortfolioFeatureBurn({ account, address, network }: { account: Account; address: Address; network: Network }) {
  const navigate = useNavigate()
  const mutation = useSplTokenBurn({ network })
  const getTransactionSigner = useGetTransactionSigner({ account })
  const { data: dataTokenAccountInfo, isLoading: isLoadingTokenAccountInfo } = useGetTokenAccountInfo({
    address,
    network,
  })
  if (isLoadingTokenAccountInfo) {
    return <UiLoader />
  }
  if (!dataTokenAccountInfo || !dataTokenAccountInfo.exists || !dataTokenAccountInfo.data) {
    return <UiError message={new Error('Error fetching token account info')} title="No token account info" />
  }

  // @ts-expect-error figure out how to type this
  const tokenAmount = dataTokenAccountInfo.data.tokenAmount
  // @ts-expect-error figure out how to type this
  const mint = dataTokenAccountInfo.data.mint
  return (
    <>
      <PortfolioUiBurn
        account={dataTokenAccountInfo.address}
        amount={tokenAmount.uiAmountString}
        confirm={async (input) => {
          console.log('input', input)
          const transactionSigner = await getTransactionSigner()
          const { signature } = await mutation.mutateAsync({
            account: address,
            amount: uiAmountToBigInt(input.amount, tokenAmount.decimals),
            mint,
            transactionSigner,
          })
          if (signature) {
            await navigate(`/modals/complete/${signature}`)
          }
        }}
        isLoading={mutation.isPending}
      />
      <UiDebug data={dataTokenAccountInfo.data} />
    </>
  )
}
