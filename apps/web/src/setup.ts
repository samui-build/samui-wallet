import { setup } from '@workspace/wallet-standard'

const preloadErrorReloadKey = 'samui:preload-error-reloaded'

window.addEventListener('load', () => {
  sessionStorage.removeItem(preloadErrorReloadKey)
})

window.addEventListener('vite:preloadError', (event) => {
  if (sessionStorage.getItem(preloadErrorReloadKey)) {
    return
  }

  event.preventDefault()
  sessionStorage.setItem(preloadErrorReloadKey, 'true')
  window.location.reload()
})

setup()
