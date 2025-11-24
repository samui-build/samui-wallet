import type { GetExplorerUrlProps } from '@workspace/solana-client/get-explorer-url'
import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'

export function ExplorerUiExplorerIcon({
  className,
  ...props
}: {
  className?: string
} & GetExplorerUrlProps) {
  const href = getExplorerUrl(props)
  return (
    <a
      className={cn('link inline-flex gap-1 font-mono', className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title="View in Explorer"
    >
      <UiIcon className="size-3" icon="explorer" />
    </a>
  )
}
