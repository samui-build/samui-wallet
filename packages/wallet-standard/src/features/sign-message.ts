import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { sendMessage } from '@workspace/background/window'
import { ensureUint8Array } from '@workspace/keypair/ensure-uint8array'

export async function signMessage(...inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  const outputs = await sendMessage('signMessage', inputs)

  return outputs.map((output) => ({
    signature: ensureUint8Array(output.signature),
    signatureType: output.signatureType,
    signedMessage: ensureUint8Array(output.signedMessage),
  }))
}
