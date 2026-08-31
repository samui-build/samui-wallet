import { LucideArrowLeft } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { Button } from './button.tsx'

export interface UiBackButtonProps extends ComponentProps<typeof Button> {
  to?: string
}
export function UiBackButton({ 'aria-label': ariaLabel = 'Back', to = '..', ...props }: UiBackButtonProps) {
  return (
    <Button aria-label={ariaLabel} asChild size="icon" variant="outline" {...props}>
      <Link to={to}>
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
