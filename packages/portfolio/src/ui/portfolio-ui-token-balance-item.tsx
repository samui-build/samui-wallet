import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link, useLocation } from 'react-router'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import { PortfolioUiTokenBalanceItemMenu } from './portfolio-ui-token-balance-item-menu.tsx'

export function PortfolioUiTokenBalanceItem({ item, showMenu = false }: { item: TokenBalance; showMenu?: boolean }) {
  const name = item.metadata?.name ?? ellipsify(item.mint)
  const symbol = item.metadata?.symbol ?? ellipsify(item.mint, 2, '').toLocaleUpperCase()
  const icon = item.metadata?.icon
  const { pathname: from } = useLocation()

  return (
    <Link className="flex w-full items-center justify-between gap-4" state={{ from }} to={`/modals/send/${item.mint}`}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {icon ? (
          <UiAvatar className="size-12 shrink-0" label={name} src={icon} />
        ) : (
          <UiAvatar className="size-12 shrink-0" label={symbol} />
        )}
        <div className="flex min-w-0 flex-col gap-0.5 text-left">
          <div className="truncate font-semibold text-sm">{name}</div>
          <div className="truncate text-muted-foreground/70 text-xs">{symbol}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <div className="font-semibold text-sm">{item.balanceToken}</div>
          <div className="text-muted-foreground/60 text-xs">${item.balanceUsd}</div>
        </div>
        {showMenu ? <PortfolioUiTokenBalanceItemMenu item={item} /> : null}
      </div>
    </Link>
  )
}
