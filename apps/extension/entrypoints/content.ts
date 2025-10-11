import { handlers } from '@workspace/background/content'

export default defineContentScript({
  async main() {
    handlers()

    await injectScript('/injected.js', {
      keepInDom: true,
    })
  },
  matches: ['<all_urls>'],
})
