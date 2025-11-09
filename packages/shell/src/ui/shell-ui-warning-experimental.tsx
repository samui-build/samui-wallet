import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'

export function ShellUiWarningExperimental() {
  const [accepted, setAccepted] = useDbSetting('warningAcceptExperimental')
  return accepted !== 'true' ? <UiExperimentalWarning close={() => setAccepted('true')} /> : null
}
