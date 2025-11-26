import { useTranslation } from '@workspace/i18n'
import { LucideArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from './button.tsx'

export function UiBack({ to = '..' }: { to?: string }) {
  const { t } = useTranslation('ui')
  return (
    <Button aria-label={t(($) => $.buttonBack)} asChild size="icon" variant="outline">
      <Link to={to}>
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
