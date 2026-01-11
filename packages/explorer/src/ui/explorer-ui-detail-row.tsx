import type { ComponentProps, ReactNode } from 'react'

export function ExplorerUiDetailRow({
  label,
  value,
  ...props
}: Omit<ComponentProps<'div'>, 'children'> & { label: string; value: null | ReactNode | undefined }) {
  return (
    <div className="text-sm" {...props}>
      <div className="mb-1 text-xs tracking-wider opacity-60">{label}</div>
      <div className="break-all font-medium">{value ?? 'N/A'}</div>
    </div>
  )
}
