import { allowWindowMessaging } from 'webext-bridge/content-script'

export default defineContentScript({
  async main() {
    allowWindowMessaging('samui')

    await injectScript('/injected.js', {
      keepInDom: true,
    })
  },
  matches: ['<all_urls>'],
})
