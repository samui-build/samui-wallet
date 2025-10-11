import { setupWindow } from '@workspace/background/setup-window'
import { setup } from '@workspace/wallet-standard'

export default defineUnlistedScript(() => {
  setupWindow()
  setup()
})
