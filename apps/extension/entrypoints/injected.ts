import { setup } from '@workspace/wallet-standard'
import { sendMessage, setNamespace } from 'webext-bridge/window'

import { ACTIONS } from '../utils/actions'

const sendPingMessage = async () => {
  const response = await sendMessage(
    ACTIONS.PING,
    {
      data: 'Hello, World!',
    },
    'background',
  )

  console.log('Response from background:', response)
}

export default defineUnlistedScript(() => {
  setNamespace('samui')

  setup()

  sendPingMessage()
})
