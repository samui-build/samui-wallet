import { sendMessage } from '@workspace/background/window'

export async function disconnect(): Promise<void> {
  const response = await sendMessage('disconnect')
  console.log('Disconnect', response)
}
