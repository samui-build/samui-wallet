import { cn } from '../lib/utils.ts'
import { UiLoader } from './ui-loader.tsx'

export function UiLoaderFull({ className, classNameSpinner }: { className?: string; classNameSpinner?: string }) {
  return (
    <div className={cn('flex items-center justify-center h-full w-full', className)}>
      <UiLoader className={classNameSpinner} />
    </div>
  )
}
