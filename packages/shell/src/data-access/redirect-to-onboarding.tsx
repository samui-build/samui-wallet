import { redirect } from 'react-router'
import type { ShellMode } from '../shell-feature.tsx'

export function redirectToOnboarding(mode: ShellMode) {
  const url = new URL(window.location.href)
  switch (mode) {
    case 'Popup':
    case 'Sidebar':
      window.open(`${url.origin}/onboarding.html`, 'onboarding')
      window.close()
      return
    default:
      return redirect('/onboarding')
  }
}
