import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

import { sendSignTransactionMessage } from '@workspace/background/send-message'

export async function signTransaction(...inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  const response = await sendSignTransactionMessage(inputs)
  console.log('Sign Transaction', response)

  return response
}
