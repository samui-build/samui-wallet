import { type Lamports, lamports } from '@solana/kit'
import { Badge } from '@workspace/ui/components/badge'
import { getColorByName } from '@workspace/ui/lib/get-initials-colors'
import { cn } from '@workspace/ui/lib/utils'
import { formatBalance } from '../data-access/format-balance.tsx'

export function ExplorerUiBalanceDiff({
  decimals,
  post,
  pre,
}: {
  decimals: number
  post?: Lamports | bigint | undefined
  pre?: Lamports | bigint | undefined
}) {
  const green = getColorByName('green')
  const red = getColorByName('red')
  const diff = (post ?? lamports(0n)) - (pre ?? lamports(0n))

  return (
    <Badge
      className={cn({
        [`${green.bg} ${green.text}`]: diff > 0,
        [`${red.bg} ${red.text}`]: diff < 0,
      })}
      variant={diff === 0n ? 'outline' : undefined}
    >
      {diff > 0 ? '+' : null}
      {formatBalance({ balance: diff, decimals })}
    </Badge>
  )
}
