import { setup } from '@workspace/wallet-standard'

export default defineContentScript({
  runAt: 'document_start',
  world: 'MAIN',
  matches: ['<all_urls>'],
  main() {
    setup()
  },
})
