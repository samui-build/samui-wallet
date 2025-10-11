import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { sendSignMessage } from '@workspace/background/send-message'

export async function signMessage(...inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  const response = await sendSignMessage(inputs)
  console.log('Sign Message', response)

  return response
}
