import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { UiBack } from '@workspace/ui/components/ui-back'
import { ChevronRightIcon, LucideHardDrive, LucideNotepadText } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsFeatureAccountCreate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Item size="sm" variant="default">
          <ItemMedia>
            <LucideNotepadText className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Seed phrases</ItemTitle>
          </ItemContent>
        </Item>

        <Item asChild variant="outline">
          <Link to="../generate">
            <ItemContent>
              <ItemTitle>Generate a new account</ItemTitle>
              <ItemDescription>Generate a new seed phrase and derive a wallet</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
        <Item asChild variant="outline">
          <Link to="../import">
            <ItemContent>
              <ItemTitle>Import an existing account</ItemTitle>
              <ItemDescription>Import an existing seed phrase and discover wallets</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>

        <Item size="sm" variant="default">
          <ItemMedia>
            <LucideHardDrive className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Hardware wallets</ItemTitle>
          </ItemContent>
        </Item>

        <Item asChild className="cursor-not-allowed" variant="muted">
          <Link to="#">
            <ItemContent>
              <ItemTitle>Connect Unruggable Wallet</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="default">Coming soon</Badge>
            </ItemActions>
          </Link>
        </Item>
      </CardContent>
    </Card>
  )
}
