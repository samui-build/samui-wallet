import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'
import { Link } from 'react-router'

export function OnboardingFeatureIndex() {
  const { t } = useTranslation('onboarding')
  const [warningAcceptExperimental, setWarningAcceptExperimental] = useSetting('warningAcceptExperimental')
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">{t(($) => $.indexPageTitle)}</div>
        <div className="text-lg text-muted-foreground">{t(($) => $.indexPageDescription)}</div>
      </div>
      {warningAcceptExperimental === 'true' ? null : (
        <UiExperimentalWarning close={() => setWarningAcceptExperimental('true')} />
      )}
      <div className="flex w-full flex-col space-y-2">
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
