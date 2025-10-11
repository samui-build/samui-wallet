import type { StandardConnectInput, StandardConnectOutput } from '@wallet-standard/core'

export async function connect(input?: StandardConnectInput): Promise<StandardConnectOutput> {
  console.log('Connect', input)

  return { accounts: [] }
}
