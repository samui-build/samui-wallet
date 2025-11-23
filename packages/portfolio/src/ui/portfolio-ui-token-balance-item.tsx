import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'

export function PortfolioUiTokenBalanceItem({ item }: { item: TokenBalance }) {
  const name = item.metadata?.name ?? ellipsify(item.mint)
  const symbol = item.metadata?.symbol ?? ellipsify(item.mint, 2, '').toLocaleUpperCase()
  const icon = item.metadata?.icon
  return (
    <div className="flex w-full items-center justify-between gap-4" key={item.mint}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {icon ? (
          <UiAvatar className="size-12 shrink-0" label={name} src={icon} />
        ) : (
          <UiAvatar className="size-12 shrink-0" label={symbol} />
        )}
        <div className="flex min-w-0 flex-col gap-0.5 text-left">
          <div className="text-sm font-semibold truncate">{name}</div>
          <div className="text-xs text-muted-foreground/70 truncate">{symbol}</div>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <div className="text-sm font-semibold">{item.balanceToken}</div>
        <div className="text-xs text-muted-foreground/60">${item.balanceUsd}</div>
      </div>
    </div>
  )
}
