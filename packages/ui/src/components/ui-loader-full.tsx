import { cn } from '../lib/utils.js'
import { UiLoader } from './ui-loader.js'

export function UiLoaderFull({ className, classNameSpinner }: { className?: string; classNameSpinner?: string }) {
  return (
    <div className={cn('flex items-center justify-center h-full w-full', className)}>
      <UiLoader className={classNameSpinner} />
    </div>
  )
}
