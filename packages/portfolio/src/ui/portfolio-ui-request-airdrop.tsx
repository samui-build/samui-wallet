import type { Lamports } from '@solana/kit'
import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { Button } from '@workspace/ui/components/button'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { ArrowUpRightIcon, Coins, LucideUmbrella } from 'lucide-react'

export function PortfolioUiRequestAirdrop({
  account,
  lamports,
  network,
}: {
  account: Account
  lamports?: Lamports | undefined
  network: Network
}) {
  const { isPending, mutateAsync } = useRequestAirdrop(network)
  const hasBalance = lamports && lamports > 0
  const isMainnet = network.type === 'solana:mainnet'
  const isLocalnet = network.type === 'solana:localnet'
  if (hasBalance || isMainnet) {
    return null
  }

  return (
    <UiEmpty description="Request your airdrop to get started." icon={LucideUmbrella} title="Request Airdrop">
      <Button disabled={isPending} onClick={() => mutateAsync({ address: account.publicKey, amount: 1 })}>
        <Coins /> Request Airdrop
      </Button>
      {isLocalnet ? null : (
        <Button asChild className="text-muted-foreground" size="sm" variant="link">
          <a href="https://faucet.solana.com/" rel="noopener noreferrer" target="_blank">
            Use Faucet <ArrowUpRightIcon />
          </a>
        </Button>
      )}
    </UiEmpty>
  )
}
