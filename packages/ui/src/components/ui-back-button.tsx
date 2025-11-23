import { useTranslation } from '@workspace/i18n'
import { LucideArrowLeft } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { Button } from './button.tsx'

export function UiBackButton(props: ComponentProps<typeof Button>) {
  const { t } = useTranslation('ui')
  return (
    <Button asChild size="icon" variant="outline" {...props} aria-label={t(($) => $.buttonBack)}>
      <Link to="..">
        <LucideArrowLeft />
      </Link>
    </Button>
  )
}
