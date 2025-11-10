import type { GetExplorerUrlProps } from '@workspace/solana-client/get-explorer-url'
import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { cn } from '@workspace/ui/lib/utils'

export function PortfolioUiExplorerLink({
  className,
  label,
  ...props
}: {
  className?: string
  label: string
} & GetExplorerUrlProps) {
  const href = getExplorerUrl(props)
  return (
    <UiTooltip content="View in Explorer">
      <a
        className={cn('link font-mono inline-flex items-center gap-1', className)}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {label}
        <UiIcon icon="externalLink" />
      </a>
    </UiTooltip>
  )
}
