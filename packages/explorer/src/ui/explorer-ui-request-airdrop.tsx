import type { Address, Lamports } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { Button } from '@workspace/ui/components/button'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function ExplorerUiRequestAirdrop({
  address,
  lamports,
  network,
}: {
  address: Address
  lamports?: Lamports | undefined
  network: Network
}) {
  const { t } = useTranslation('explorer')
  const { isPending, mutateAsync } = useRequestAirdrop(network)
  const hasBalance = lamports && lamports > 0
  const isMainnet = network.type === 'solana:mainnet'
  const isLocalnet = network.type === 'solana:localnet'
  if (hasBalance || isMainnet) {
    return null
  }

  return (
    <UiEmpty description={t(($) => $.requestAirdropDescription)} icon="airdrop" title={t(($) => $.requestAirdropTitle)}>
      <Button disabled={isPending} onClick={() => mutateAsync({ address, amount: solToLamports('1') })}>
        <UiIcon icon="coins" /> {t(($) => $.actionRequestAirdrop)}
      </Button>
      {isLocalnet ? null : (
        <Button asChild className="text-muted-foreground" size="sm" variant="link">
          <a href="https://faucet.solana.com/" rel="noopener noreferrer" target="_blank">
            {t(($) => $.actionUseFaucet)} <UiIcon icon="externalLink" />
          </a>
        </Button>
      )}
    </UiEmpty>
  )
}
