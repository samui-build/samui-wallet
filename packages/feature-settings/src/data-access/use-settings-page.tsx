import { useSettingsPages } from './use-settings-pages.tsx'

export function useSettingsPage({ pageId }: { pageId: string }) {
  const pages = useSettingsPages()
  const found = pages.find((item) => item.id === pageId)
  if (!found) {
    throw new Error('Page not found')
  }
  return found
}
