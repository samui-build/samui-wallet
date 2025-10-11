import { setupContentScript } from '@workspace/background/setup-content-script'

export default defineContentScript({
  async main() {
    setupContentScript()

    await injectScript('/injected.js', {
      keepInDom: true,
    })
  },
  matches: ['<all_urls>'],
})
