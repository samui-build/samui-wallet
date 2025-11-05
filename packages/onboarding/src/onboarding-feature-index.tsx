import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'
import { Link } from 'react-router'

export function OnboardingFeatureIndex() {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useDbPreference('warningAcceptExperimental')
  return (
    <div className="flex flex-col gap-6 items-center min-w-[400px]">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-2xl">Welcome to 🏝️ Samui Wallet</div>
        <div className="text-lg text-muted-foreground">{t(($) => $['We hope you enjoy your stay!'])}</div>
      </div>
      {accepted === 'true' ? null : <UiExperimentalWarning close={() => setAccepted('true')} />}
      <div className="flex flex-col space-y-2 w-full">
        <Button asChild>
          <Link to="generate">Create a new wallet</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="import">I already have a wallet</Link>
        </Button>
      </div>
    </div>
  )
}
