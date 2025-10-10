export default defineContentScript({
  async main() {
    await injectScript('/injected.js', {
      keepInDom: true,
    })

    // TODO: Validate messages before forwarding them
    // TODO: Consider using https://wxt.dev/guide/essentials/messaging.html
    window.addEventListener('message', (event) => browser.runtime.sendMessage(event.data))
  },
  matches: ['<all_urls>'],
})
