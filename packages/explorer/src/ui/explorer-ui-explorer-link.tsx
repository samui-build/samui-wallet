import { type GetExplorerUrlProps, getExplorerName, getExplorerUrl } from '@workspace/solana-client/get-explorer-url'
import { UiIcon } from '@workspace/ui/components/ui-icon'
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
    <a
      className={cn('inline-flex items-center gap-1 font-mono hover:underline', className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={`View in ${name}`}
    >
      {label ?? name}
      <UiIcon className="size-3 shrink-0" icon="externalLink" />
    </a>
  )
}
