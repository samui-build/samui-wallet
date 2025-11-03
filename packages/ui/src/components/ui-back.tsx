import { LucideArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from './button.tsx'

export function UiBack({ to = '..' }: { to?: string }) {
  return (
    <Button asChild size="icon" variant="outline">
      <Link to={to}>
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
