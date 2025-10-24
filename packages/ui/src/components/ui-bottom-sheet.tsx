import type { ReactNode } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet.js'

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
      <SheetContent className="w-full sm:w-[400px] sm:left-1/2 sm:-translate-x-1/2" side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 pb-10 items-center md:aspect-square">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
