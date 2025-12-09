import { browser } from '@wxt-dev/browser'

export async function openSidePanel() {
  browser.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  })

  const currentWindow = await browser.windows.getCurrent()
  const windowId = currentWindow.id

  if (!windowId) {
    throw new Error('Window id is not found')
  }

  await browser.sidePanel.open({ windowId })
  window.close()
}

export async function closeSidePanel() {
  browser.sidePanel.setPanelBehavior({
    openPanelOnActionClick: false,
  })
  window.close()
}
