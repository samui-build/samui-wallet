import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { decodeTransportBytes } from '@workspace/background/transport-bytes'
import { sendMessage } from '@workspace/background/window'

export async function signMessage(...inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> {
  const outputs = await sendMessage('signMessage', inputs)

  return outputs.map((output) => ({
    ...output,
    signature: decodeTransportBytes(output.signature),
    signedMessage: decodeTransportBytes(output.signedMessage),
  }))
}
