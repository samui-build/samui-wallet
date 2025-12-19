import type { ComponentProps, ReactNode } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet.tsx'

export function UiBottomSheet({
  children,
  description,
  title,
  ...props
}: ComponentProps<typeof Sheet> & {
  children: ReactNode
  description: ReactNode
  title: ReactNode
}) {
  return (
    <Sheet {...props}>
      <SheetContent className="w-full sm:left-1/2 sm:w-[400px] sm:-translate-x-1/2" side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
