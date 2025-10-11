import { connect } from './actions/connect'
import { disconnect } from './actions/disconnect'
import { signAndSendTransaction } from './actions/sign-and-send-transaction'
import { signIn } from './actions/sign-in'
import { signMessage } from './actions/sign-message'
import { signTransaction } from './actions/sign-transaction'
import { onMessage } from './extension'

export function handlers() {
  onMessage('connect', async ({ data }) => await connect(data))
  onMessage('disconnect', async () => await disconnect())
  onMessage('signAndSendTransaction', async ({ data }) => await signAndSendTransaction(data))
  onMessage('signIn', async ({ data }) => await signIn(data))
  onMessage('signMessage', async ({ data }) => await signMessage(data))
  onMessage('signTransaction', async ({ data }) => await signTransaction(data))
}
