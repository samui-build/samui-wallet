import { assertIsSignature } from './index'

export function isValidSignature(signature: string) {
  try {
    assertIsSignature(signature)
    return true
  } catch {
    return false
  }
}
