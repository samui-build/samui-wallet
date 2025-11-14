import { redirect } from 'react-router'
import type { ShellContext } from '../shell-feature.tsx'

export function redirectToOnboarding(context: ShellContext) {
  const url = new URL(window.location.href)
  switch (context) {
    case 'Popup':
    case 'Sidebar':
      window.open(`${url.origin}/onboarding.html`, 'onboarding')
      window.close()
      return
    default:
      return redirect('/onboarding')
  }
}
