import type { Address } from '@solana/kit'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'
import { useExplorerBookmarkAccount } from './data-access/use-explorer-bookmark-account.tsx'

export function ExplorerFeatureBookmarkAccountButton({ address }: { address: Address }) {
  const { t } = useTranslation('explorer')
  const { hasBookmark, toggle } = useExplorerBookmarkAccount({ address })

  return (
    <Button
      onClick={toggle}
      size="sm"
      title={`${hasBookmark ? t(($) => $.bookmarkRemove) : t(($) => $.bookmarkAdd)}`}
      variant="secondary"
    >
      <UiIcon
        className={cn({ 'text-yellow-500': hasBookmark })}
        icon={hasBookmark ? 'bookmarkRemove' : 'bookmarkAdd'}
      />
    </Button>
  )
}
