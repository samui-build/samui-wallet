import { LucideArrowLeft } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { Button } from './button.tsx'

export function UiBackButton({ to = '..', ...props }: ComponentProps<typeof Button> & { to?: string }) {
  return (
    <Button asChild size="icon" variant="outline" {...props}>
      <Link to={to}>
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
