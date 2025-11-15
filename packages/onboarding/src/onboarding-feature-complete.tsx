import { useTranslation } from '@workspace/i18n'

export function OnboardingFeatureComplete() {
  const { t } = useTranslation('onboarding')
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">{t(($) => $.onboardingPageTitle)}</div>
        <div className="text-lg text-muted-foreground">{t(($) => $.onboardingPageDescription)}</div>
      </div>
    </div>
  )
}
