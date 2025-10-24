import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

import type { TokenBalance } from '../data-access/use-get-token-metadata.js'

export function PortfolioUiTokenBalanceItem({ item }: { item: TokenBalance }) {
  const name = item.metadata?.name ?? ellipsify(item.mint)
  const symbol = item.metadata?.symbol ?? ellipsify(item.mint, 2, '').toLocaleUpperCase()
  const icon = item.metadata?.icon
  return (
    <div className="flex justify-between items-center w-full" key={item.mint}>
      <div className="flex items-center gap-2">
        <div className="flex justify-center items-center size-14">
          {icon ? (
            <UiAvatar className="size-12" label={name} src={icon} />
          ) : (
            <UiAvatar className="size-12" label={symbol} />
          )}
        </div>
        <div className="flex flex-col items-start mr-6">
          <div className="font-bold">{name}</div>
          <div className="text-muted-foreground">{symbol}</div>
        </div>
      </div>
      <div className="flex flex-col items-end" style={{ flexGrow: 1 }}>
        <div>$ {item.balanceUsd}</div>
        <div className="text-muted-foreground text-sm">{item.balanceToken}</div>
      </div>
    </div>
  )
}
