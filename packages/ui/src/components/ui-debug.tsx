import type { ReactNode } from 'react'
import superjson from 'superjson'
import { UiPre, type UiPreProps } from './ui-pre.tsx'

export function UiDebug({ data, className, ...props }: { data: string | unknown } & UiPreProps) {
  const content: ReactNode = typeof data === 'string' ? data : JSON.stringify(superjson.serialize(data).json, null, 2)

  return (
    <UiPre className={className} {...props}>
      {content}
    </UiPre>
  )
}
