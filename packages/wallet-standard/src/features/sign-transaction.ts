import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'

export async function signTransaction(...inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  const response = await sendMessage('signTransaction', inputs)
  console.log('Sign Transaction', response)

  return response
}
