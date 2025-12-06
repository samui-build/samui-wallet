import type { ComponentProps, ReactNode } from 'react'
import superjson from 'superjson'
import { cn } from '../lib/utils.ts'

export function UiDebug({
  data,
  className,
  ...props
}: { data: string | unknown } & Omit<ComponentProps<'pre'>, 'children'>) {
  const content: ReactNode = typeof data === 'string' ? data : JSON.stringify(superjson.serialize(data).json, null, 2)

  return (
    <pre className={cn('overflow-auto whitespace-pre-wrap text-[9px]', className)} {...props}>
      {content}
    </pre>
  )
}
