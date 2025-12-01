import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'

export function ShellUiMenuActionsSidebar() {
  const { t } = useTranslation('shell')
  return (
    <Button aria-label={t(($) => $.actionsSidebarHide)} onClick={() => window.close()} size="icon" variant="secondary">
      <UiIcon icon="sidebarClose" />
    </Button>
  )
}
