import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'

export async function signMessage(...inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  const response = await sendMessage('signMessage', inputs)
  console.log('Sign Message', response)

  return response
}
