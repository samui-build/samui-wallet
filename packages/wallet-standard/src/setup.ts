import { registerWallet } from '@wallet-standard/core'

import { SamuiWallet } from './wallet'

export function setup() {
  registerWallet(new SamuiWallet())
}
