import { sendMessage } from './extension.ts'
import { onMessage } from './window.ts'

export function handlers() {
  onMessage('connect', async ({ data }) => await sendMessage('connect', data))
  onMessage('disconnect', async () => await sendMessage('disconnect'))
  onMessage('signAndSendTransaction', async ({ data }) => await sendMessage('signAndSendTransaction', data))
  onMessage('signIn', async ({ data }) => await sendMessage('signIn', data))
  onMessage('signMessage', async ({ data }) => await sendMessage('signMessage', data))
  onMessage('signTransaction', async ({ data }) => await sendMessage('signTransaction', data))
}
