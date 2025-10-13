import { Button } from '@workspace/ui/components/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { LucideWallet2 } from 'lucide-react'
import { Link } from 'react-router'

export function SettingsUiAccountEmpty() {
  return (
    <Empty className="border border-dotted">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LucideWallet2 />
        </EmptyMedia>
        <EmptyTitle>No accounts found</EmptyTitle>
        <EmptyDescription>Create a new account by generating a seed phrase or importing one</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="generate">Generate</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="import">Import</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
