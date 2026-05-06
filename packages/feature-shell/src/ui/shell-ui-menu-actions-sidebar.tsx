import { closeSidePanel } from '@workspace/background/sidepanel'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function ShellUiMenuActionsSidebar() {
  const { t } = useTranslation('shell')
  return (
    <Button onClick={closeSidePanel} size="icon" title={t(($) => $.actionsSidebarHide)} variant="secondary">
      <UiIcon icon="sidebarClose" />
    </Button>
  )
}
