import { cn } from '../lib/utils.ts'
import { Spinner } from './spinner.tsx'

export function UiLoader({ className }: { className?: string | undefined }) {
  return <Spinner className={cn('size-12', className)} />
}
