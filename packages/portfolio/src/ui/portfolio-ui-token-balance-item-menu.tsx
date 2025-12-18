import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link, useLocation } from 'react-router'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'

export function PortfolioUiTokenBalanceItemMenu({ item }: { item: TokenBalance }) {
  const { t } = useTranslation('portfolio')
  const { pathname: from } = useLocation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <UiIcon icon="menu" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link state={{ from }} to={`/explorer/address/${item.account}`}>
            {t(($) => $.viewExplorerAccount)}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link state={{ from }} to={`/explorer/address/${item.mint}`}>
            {t(($) => $.viewExplorerToken)}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link state={{ from }} to={`/modals/burn/${item.account}`}>
            {t(($) => $.burnTokens)}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
