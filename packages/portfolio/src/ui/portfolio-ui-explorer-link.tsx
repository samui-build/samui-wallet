import type { GetExplorerUrlProps } from '@workspace/solana-client/get-explorer-url'

import { getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { cn } from '@workspace/ui/lib/utils'
import { ArrowUpRightFromSquare } from 'lucide-react'

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
    <a
      className={cn('link font-mono inline-flex gap-1', className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
      <ArrowUpRightFromSquare size={12} />
    </a>
  )
}
