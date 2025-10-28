import type {
  SolanaSignAndSendTransactionInput,
  SolanaSignAndSendTransactionOutput,
} from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'
import { ensureUint8Array } from '@workspace/keypair/ensure-uint8array'

export async function signAndSendTransaction(
  ...inputs: SolanaSignAndSendTransactionInput[]
): Promise<SolanaSignAndSendTransactionOutput[]> {
  const response = await sendMessage('signAndSendTransaction', inputs)

  return response.map((output) => ({
    ...output,
    signature: ensureUint8Array(output.signature),
  }))
}
