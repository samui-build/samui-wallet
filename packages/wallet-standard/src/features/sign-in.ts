import type { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features'

import { decodeTransportBytes } from '@workspace/background/transport-bytes'
import { sendMessage } from '@workspace/background/window'

export async function signIn(...inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> {
  const outputs = await sendMessage('signIn', inputs)

  return outputs.map((output) => ({
    ...output,
    signature: decodeTransportBytes(output.signature),
    signedMessage: decodeTransportBytes(output.signedMessage),
  }))
}
