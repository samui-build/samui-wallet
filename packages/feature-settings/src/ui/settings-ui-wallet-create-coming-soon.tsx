import { Badge } from '@workspace/ui/components/badge'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@workspace/ui/components/item'
import { Link } from 'react-router'

export function SettingsUiWalletCreateComingSoon({
  description,
  title,
  to = '#',
}: {
  description: string
  title: string
  to?: string
}) {
  return (
    <Item asChild className="cursor-not-allowed" variant="muted">
      <Link to={to}>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="secondary">Coming soon</Badge>
        </ItemActions>
      </Link>
    </Item>
  )
}
