import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'
import { UiContainer, type UiContainerProps } from './ui-container.tsx'

export interface UiPageProps extends ComponentProps<'div'> {
  containerProps?: UiContainerProps
  withContainer?: boolean
}
export function UiPage({ children, className, containerProps, withContainer = true, ...props }: UiPageProps) {
  return (
    <div
      className={cn(
        'lg:max-w-5xl lg:py-8 md:max-w-4xl md:py-6 mx-auto py-2 sm:max-w-3xl sm:py-4 xl:max-w-6xl',
        className,
      )}
      {...props}
    >
      {withContainer ? <UiContainer {...containerProps}>{children}</UiContainer> : children}
    </div>
  )
}
