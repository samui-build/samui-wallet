import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'
import { ensureUint8Array } from '@workspace/keypair/ensure-uint8array'

export async function signTransaction(...inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  const response = await sendMessage('signTransaction', inputs)

  return response.map((output) => ({
    ...output,
    signedTransaction: ensureUint8Array(output.signedTransaction),
  }))
}
