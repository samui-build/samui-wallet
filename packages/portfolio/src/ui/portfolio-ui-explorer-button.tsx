import type { GetExplorerUrlProps } from '@workspace/solana-client/get-explorer-url'

import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { Button } from '@workspace/ui/components/button'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { cn } from '@workspace/ui/lib/utils'
import { ArrowUpRightFromSquare } from 'lucide-react'

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
          <ArrowUpRightFromSquare size={12} />
        </a>
      </Button>
    </UiTooltip>
  )
}
