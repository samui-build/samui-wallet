import type { Address } from '@solana/kit'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'
import { useExplorerBookmarkAccount } from './data-access/use-explorer-bookmark-account.tsx'

export function ExplorerFeatureAccountBookmarkButton({ address }: { address: Address }) {
  const { hasBookmark, isLoading, isError, toggle } = useExplorerBookmarkAccount({ address })
  if (isLoading) {
    return null
  }
  if (isError) {
    return null
  }
  return (
    <Button onClick={toggle} size="sm" title={`${hasBookmark ? 'Remove' : 'Add'} bookmark`} variant="secondary">
      <UiIcon
        className={cn({ 'text-yellow-500': hasBookmark })}
        icon={hasBookmark ? 'bookmarkRemove' : 'bookmarkAdd'}
      />
    </Button>
  )
}
