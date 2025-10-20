import { cn } from '../lib/utils.js'
import { Spinner } from './spinner.js'

export function UiLoader({ className }: { className?: string }) {
  return <Spinner className={cn('size-12', className)} />
}
