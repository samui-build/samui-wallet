import { useTranslation } from '@workspace/i18n'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link, useLocation } from 'react-router'
import type { TokenBalance } from '../data-access/use-get-token-balances.ts'

export function PortfolioUiTokenBalanceItemMenu({ item }: { item: TokenBalance }) {
  const { t } = useTranslation('portfolio')
  const { pathname: from } = useLocation()
  const canBurn = item.mint !== NATIVE_MINT && item.balance > 0n
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <UiIcon icon="menu" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link state={{ from }} to={`/explorer/address/${item.account}`}>
            {t(($) => $.viewExplorerAccount)}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link state={{ from }} to={`/explorer/address/${item.mint}`}>
            {t(($) => $.viewExplorerToken)}
          </Link>
        </DropdownMenuItem>
        {canBurn ? (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link state={{ from }} to={`/modals/burn/${item.account}`}>
              {t(($) => $.burnTokens)}
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>{t(($) => $.burnTokens)}</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
