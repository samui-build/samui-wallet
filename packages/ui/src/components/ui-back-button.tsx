import { LucideArrowLeft } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { Button } from './button.tsx'

export function UiBackButton(props: ComponentProps<typeof Button>) {
  return (
    <Button asChild size="icon" variant="outline" {...props}>
      <Link to="..">
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
