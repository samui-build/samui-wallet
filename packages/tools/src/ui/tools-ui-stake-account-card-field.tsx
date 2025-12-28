import type { ReactNode } from 'react'

export function ToolsUiStakeAccountCardField({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: ReactNode
}) {
  return (
    <div className={className}>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="mt-1 min-w-0 font-medium text-sm">{value}</div>
    </div>
  )
}
