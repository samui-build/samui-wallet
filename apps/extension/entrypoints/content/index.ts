import { setup } from '@workspace/wallet-standard'

export default defineContentScript({
  main() {
    setup()
  },
  matches: ['<all_urls>'],
  runAt: 'document_start',
  world: 'MAIN',
})
