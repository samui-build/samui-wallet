import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

export async function connect(input?: StandardConnectInput): Promise<StandardConnectOutput> {
  console.log('connect called', input)
  return { accounts: [] }
}
