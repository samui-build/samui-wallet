import { useSetting } from '@workspace/db-react/use-setting'
import { UiExperimentalWarning } from '@workspace/ui/components/ui-experimental-warning'

export function ShellUiWarningExperimental() {
  const [warningAcceptExperimental, setWarningAcceptExperimental] = useSetting('warningAcceptExperimental')
  return warningAcceptExperimental !== 'true' ? (
    <UiExperimentalWarning close={() => setWarningAcceptExperimental('true')} />
  ) : null
}
