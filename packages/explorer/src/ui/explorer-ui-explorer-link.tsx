import { type GetExplorerUrlProps, getExplorerName, getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTooltip } from '@workspace/ui/components/ui-tooltip'
import { cn } from '@workspace/ui/lib/utils'

export function ExplorerUiExplorerLink({
  className,
  label,
  ...props
}: {
  className?: string
  label?: string
} & GetExplorerUrlProps) {
  const href = getExplorerUrl(props)
  const name = getExplorerName(props.provider)
  return (
    <UiTooltip content={`View in ${name}`}>
      <a
        className={cn('link font-mono inline-flex gap-1', className)}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {label ?? name}
        <UiIcon className="size-3" icon="externalLink" />
      </a>
    </UiTooltip>
  )
}
