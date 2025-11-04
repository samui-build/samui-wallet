import { registerWallet } from '@wallet-standard/core'

import { SamuiWallet } from './wallet.ts'

export function setup() {
  registerWallet(new SamuiWallet())
}
