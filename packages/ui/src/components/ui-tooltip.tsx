import type { ReactNode } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip.js'

export function UiTooltip({ children, content }: { children: ReactNode; content: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
