import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { type Lamports } from '@solana/kit'
import { useRequestAirdrop } from '@workspace/solana-client-react/use-request-airdrop'
import { Button } from '@workspace/ui/components/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { ArrowUpRightIcon, Coins, Umbrella } from 'lucide-react'

export function PortfolioUiRequestAirdrop({
  cluster,
  lamports,
  wallet,
}: {
  cluster: Cluster
  lamports?: Lamports | undefined
  wallet: Wallet
}) {
  const { isPending, mutateAsync } = useRequestAirdrop(cluster)
  const hasBalance = lamports && lamports > 0
  const isMainnet = cluster.type === 'solana:mainnet'
  const isLocalnet = cluster.type === 'solana:localnet'
  if (hasBalance || isMainnet) {
    return null
  }

  return (
    <Empty className="border border-dashed gap-3">
      <EmptyMedia variant="icon">
        <Umbrella />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Request Airdrop</EmptyTitle>
        <EmptyDescription>Request your airdrop to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button disabled={isPending} onClick={() => mutateAsync({ address: wallet.publicKey })}>
          <Coins /> Confirm Airdrop
        </Button>
      </EmptyContent>
      {isLocalnet ? null : (
        <Button asChild className="text-muted-foreground" size="sm" variant="link">
          <a href="https://faucet.solana.com/" rel="noopener noreferrer" target="_blank">
            Use Faucet <ArrowUpRightIcon />
          </a>
        </Button>
      )}
    </Empty>
  )
}
