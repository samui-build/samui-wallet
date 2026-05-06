import { openSidePanel } from '@workspace/background/sidepanel'
import { getRuntime } from '@workspace/env/get-runtime'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function ShellUiMenuActionsPopup() {
  const { t } = useTranslation('shell')

  if (getRuntime() !== 'extension') {
    return null
  }

  return (
    <Button onClick={openSidePanel} size="icon" title={t(($) => $.actionsSidebarShow)} variant="secondary">
      <UiIcon icon="sidebar" />
    </Button>
  )
}
