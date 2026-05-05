import type { SolanaSignTransactionInput, SolanaSignTransactionOutput } from '@solana/wallet-standard-features'

import { decodeTransportBytes } from '@workspace/background/transport-bytes'
import { sendMessage } from '@workspace/background/window'

export async function signTransaction(...inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> {
  const response = await sendMessage('signTransaction', inputs)

  return response.map((output) => ({
    ...output,
    signedTransaction: decodeTransportBytes(output.signedTransaction),
  }))
}
