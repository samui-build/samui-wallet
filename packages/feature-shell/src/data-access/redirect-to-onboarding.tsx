import { getEntrypoint } from '@workspace/env/get-entrypoint'
import { redirect } from 'react-router'

export function redirectToOnboarding() {
  const url = new URL(window.location.href)
  switch (getEntrypoint()) {
    case 'popup':
    case 'sidepanel':
      window.open(`${url.origin}/onboarding.html`, 'onboarding')
      window.close()
      return
    default:
      return redirect('/onboarding')
  }
}
