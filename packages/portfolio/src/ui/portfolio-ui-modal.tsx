import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePortfolioBackButtonTo } from '../data-access/use-portfolio-back-button-to.tsx'

export function PortfolioUiModal({ children, title }: { children: ReactNode; title: ReactNode }) {
  const { t } = useTranslation('portfolio')
  const backButtonTo = usePortfolioBackButtonTo()

  return (
    <UiCard
      backButtonTo={backButtonTo}
      className="h-full rounded-none"
      contentProps={{ className: 'flex-1 overflow-auto' }}
      footer={
        <Button asChild className="w-full" variant="secondary">
          <Link to={backButtonTo}>{t(($) => $.actionClose)}</Link>
        </Button>
      }
      title={title}
    >
      <div className="mx-auto sm:max-w-2xl md:max-w-2xl lg:max-w-2xl xl:max-w-2xl">{children}</div>
    </UiCard>
  )
}
