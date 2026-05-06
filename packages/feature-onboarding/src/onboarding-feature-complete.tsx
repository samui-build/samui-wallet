import { getRuntime } from '@workspace/env/get-runtime'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { browser } from '@wxt-dev/browser'

export function OnboardingFeatureComplete() {
  const { t } = useTranslation('onboarding')
  const runtime = getRuntime()

  const openPopup = () => {
    browser.action.openPopup()
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">{t(($) => $.onboardingPageTitle)}</div>
        <div className="text-lg text-muted-foreground">{t(($) => $.onboardingPageDescription)}</div>
        {runtime === 'extension' ? (
          <div className="flex flex-row gap-4">
            <Button onClick={openPopup}>Open popup</Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
