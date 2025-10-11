import { onMessage } from 'webext-bridge/background'

import { ACTIONS } from './actions'
import { connect } from './actions/connect'
import { disconnect } from './actions/disconnect'
import { signAndSendTransaction } from './actions/sign-and-send-transaction'
import { signIn } from './actions/sign-in'
import { signMessage } from './actions/sign-message'
import { signTransaction } from './actions/sign-transaction'

export function handlers() {
  onMessage(ACTIONS.CONNECT, async ({ data }) => await connect(data))
  onMessage(ACTIONS.DISCONNECT, async () => await disconnect())
  onMessage(ACTIONS.SIGN_AND_SEND_TRANSACTION, async ({ data }) => await signAndSendTransaction(data))
  onMessage(ACTIONS.SIGN_IN, async ({ data }) => await signIn(data))
  onMessage(ACTIONS.SIGN_MESSAGE, async ({ data }) => await signMessage(data))
  onMessage(ACTIONS.SIGN_TRANSACTION, async ({ data }) => await signTransaction(data))
}
