import { assertIsAddress } from '@solana/kit'

export function isValidAddress(address: string) {
  try {
    assertIsAddress(address)
    return true
  } catch {
    return false
  }
}
