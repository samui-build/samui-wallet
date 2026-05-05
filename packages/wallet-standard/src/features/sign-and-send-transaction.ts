import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

import { decodeTransportBytes } from '@workspace/background/transport-bytes'
import { sendMessage } from '@workspace/background/window'

export async function signAndSendTransaction(
  ...inputs: SolanaSignAndSendTransactionInput[]
): Promise<SolanaSignAndSendTransactionOutput[]> {
  const response = await sendMessage('signAndSendTransaction', inputs)

  return response.map((output) => ({
    ...output,
    signature: decodeTransportBytes(output.signature),
  }))
}
