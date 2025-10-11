import { allowWindowMessaging } from 'webext-bridge/content-script'

import { NAMESPACE } from './namespace'

export function setupContentScript() {
  allowWindowMessaging(NAMESPACE)
}
