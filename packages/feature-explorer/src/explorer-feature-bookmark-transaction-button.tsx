import type { Signature } from '@solana/kit'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'
import { useExplorerBookmarkTransaction } from './data-access/use-explorer-bookmark-transaction.tsx'

export function ExplorerFeatureBookmarkTransactionButton({ signature }: { signature: Signature }) {
  const { hasBookmark, toggle } = useExplorerBookmarkTransaction({ signature })

  return (
    <Button onClick={toggle} size="sm" title={`${hasBookmark ? 'Remove' : 'Add'} bookmark`} variant="secondary">
      <UiIcon
        className={cn({ 'text-yellow-500': hasBookmark })}
        icon={hasBookmark ? 'bookmarkRemove' : 'bookmarkAdd'}
      />
    </Button>
  )
}
