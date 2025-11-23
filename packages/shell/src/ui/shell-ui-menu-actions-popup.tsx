import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { WxtBrowser } from 'wxt/browser'

export function ShellUiMenuActionsPopup({ browser }: { browser: WxtBrowser | undefined }) {
  const { t } = useTranslation('shell')

  if (!browser || !browser?.sidePanel) {
    return null
  }

  async function openSidePanel(browser: WxtBrowser) {
    const currentWindow = await browser.windows.getCurrent()
    const windowId = currentWindow.id

    if (!windowId) {
      throw new Error('Window id is not found')
    }

    await browser.sidePanel.open({ windowId })
    window.close()
  }

  return (
    <Button
      aria-label={t(($) => $.actionsSidebarShow)}
      onClick={() => openSidePanel(browser)}
      size="icon"
      variant="secondary"
    >
      <UiIcon icon="sidebar" />
    </Button>
  )
}
