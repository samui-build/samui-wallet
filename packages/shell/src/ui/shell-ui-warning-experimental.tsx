import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'

export function ShellUiWarningExperimental() {
  const [accepted, setAccepted] = useDbPreference('warningAcceptExperimental')
  return accepted !== 'true' ? <UiExperimentalWarning close={() => setAccepted('true')} /> : null
}
