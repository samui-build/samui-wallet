import { setNamespace } from 'webext-bridge/window'

import { NAMESPACE } from './namespace'

export function setupWindow() {
  setNamespace(NAMESPACE)
}
