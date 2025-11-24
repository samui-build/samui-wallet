import { cn } from '../lib/utils.ts'
import { UiLoader } from './ui-loader.tsx'

export function UiLoaderFull({
  className,
  classNameSpinner,
}: {
  className?: string
  classNameSpinner?: string | undefined
}) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center', className)}>
      <UiLoader className={classNameSpinner} />
    </div>
  )
}
