import { onMessage } from 'webext-bridge/background'

import { ACTIONS } from '../utils/actions'

export default defineBackground(() => {
  onMessage(ACTIONS.PING, async ({ data }) => data)
})
