import { assertIsSignature } from '@solana/kit'

export function isValidSignature(signature: string) {
  try {
    assertIsSignature(signature)
    return true
  } catch {
    return false
  }
}
