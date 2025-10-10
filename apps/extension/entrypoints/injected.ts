import { setup } from '@workspace/wallet-standard'

export default defineUnlistedScript(() => {
  // TODO: Use externally_connectable when Firefox supports it https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/externally_connectable
  window.postMessage({ text: 'Hello World', type: 'PING' }, '*')

  setup()
})
