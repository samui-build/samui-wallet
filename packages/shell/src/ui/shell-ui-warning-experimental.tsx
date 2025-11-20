import { useSetting } from '@workspace/db-react/use-setting'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'

export function ShellUiWarningExperimental() {
  const [accepted, setAccepted] = useSetting('warningAcceptExperimental')
  return accepted !== 'true' ? <UiExperimentalWarning close={() => setAccepted('true')} /> : null
}
