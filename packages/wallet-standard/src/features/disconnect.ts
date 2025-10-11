import { sendDisconnectMessage } from '@workspace/background/send-message'

export async function disconnect(): Promise<void> {
  const response = await sendDisconnectMessage()
  console.log('Disconnect', response)
}
