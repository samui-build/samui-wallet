import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'
import { Link } from 'react-router'

export function OnboardingFeatureIndex() {
  const { t } = useTranslation('onboarding')
  const [accepted, setAccepted] = useDbSetting('warningAcceptExperimental')
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">{t(($) => $.indexPageTitle)}</div>
        <div className="text-lg text-muted-foreground">{t(($) => $.indexPageDescription)}</div>
      </div>
      {accepted === 'true' ? null : <UiExperimentalWarning close={() => setAccepted('true')} />}
      <div className="flex flex-col space-y-2 w-full">
        <Button asChild>
          <Link to="generate">{t(($) => $.indexLinkGenerate)}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="import">{t(($) => $.indexLinkImport)}</Link>
        </Button>
      </div>
    </div>
  )
}
