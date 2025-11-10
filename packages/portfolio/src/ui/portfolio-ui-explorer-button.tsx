import type { GetExplorerUrlProps } from '@workspace/solana-client/get-explorer-url'
import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { cn } from '@workspace/ui/lib/utils'

export function PortfolioUiExplorerButton({
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
      <Button asChild size="sm" variant="outline">
        <a
          className={cn('link font-mono inline-flex items-center gap-1', className)}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {label}
          <UiIcon icon="externalLink" />
        </a>
      </Button>
    </UiTooltip>
  )
}
