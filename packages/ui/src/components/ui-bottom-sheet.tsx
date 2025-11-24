import type { ReactNode } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet.tsx'

export function UiBottomSheet({
  children,
  description,
  title,
  trigger,
}: {
  children: ReactNode
  description: ReactNode
  title: ReactNode
  trigger: ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:-translate-x-1/2 w-full sm:left-1/2 sm:w-[400px]" side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center gap-6 pb-10 md:aspect-square">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
