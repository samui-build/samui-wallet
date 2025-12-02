import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { browser } from '@wxt-dev/browser'

export function ShellUiMenuActionsPopup() {
  const { t } = useTranslation('shell')

  if (!browser || !browser?.sidePanel) {
    return null
  }

  async function openSidePanel() {
    const currentWindow = await browser.windows.getCurrent()
    const windowId = currentWindow.id

    if (!windowId) {
      throw new Error('Window id is not found')
    }

    await browser.sidePanel.open({ windowId })
    window.close()
  }

  return (
    <Button aria-label={t(($) => $.actionsSidebarShow)} onClick={openSidePanel} size="icon" variant="secondary">
      <UiIcon icon="sidebar" />
    </Button>
  )
}
