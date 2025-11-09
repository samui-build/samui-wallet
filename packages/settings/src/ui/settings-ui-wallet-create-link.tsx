import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@workspace/ui/components/item'
import { ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiWalletCreateLink({
  description,
  title,
  to,
}: {
  description: string
  title: string
  to: string
}) {
  return (
    <Item asChild variant="outline">
      <Link to={to}>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Link>
    </Item>
  )
}
