export default defineBackground(() => {
  // TODO: Validate messages before handling them
  browser.runtime.onMessage.addListener((message, sender) => console.log(message, sender))
})
