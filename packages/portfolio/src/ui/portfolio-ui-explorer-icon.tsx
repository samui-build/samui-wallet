import type { GetExplorerUrlProps } from '@workspace/solana-client/get-explorer-url'

import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { cn } from '@workspace/ui/lib/utils'
import { LucideGlobe } from 'lucide-react'

export function PortfolioUiExplorerIcon({
  className,
  ...props
}: {
  className?: string
} & GetExplorerUrlProps) {
  const href = getExplorerUrl(props)
  return (
    <UiTooltip content="View in Explorer">
      <a
        className={cn('link font-mono inline-flex gap-1', className)}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <LucideGlobe size={12} />
      </a>
    </UiTooltip>
  )
}
