import React from 'react'
import { Button } from '@workspace/ui/components/button.js'
import { Link } from 'react-router'
import { LucideArrowLeft } from 'lucide-react'

export function UiBackButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button asChild size="icon" variant="outline" {...props}>
      <Link to="..">
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
