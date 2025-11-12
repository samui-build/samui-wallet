import {
  type ExplorerProvider,
  type GetExplorerUrlProps,
  getExplorerName,
  getExplorerUrl,
} from '@workspace/solana-client/get-explorer-url'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { cn } from '@workspace/ui/lib/utils'

export function ExplorerUiExplorerLink({
  className,
  provider,
  ...props
}: {
  className?: string
  provider: ExplorerProvider
} & GetExplorerUrlProps) {
  const href = getExplorerUrl(props)
  const name = getExplorerName(provider)
  return (
    <UiTooltip content={`View in ${name}`}>
      <a
        className={cn('link font-mono inline-flex gap-1', className)}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {name}
        <UiIcon className="size-3" icon="externalLink" />
      </a>
    </UiTooltip>
  )
}
