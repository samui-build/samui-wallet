import type { SolanaSignMessageInput, SolanaSignMessageOutput } from '@solana/wallet-standard-features'

import { createKeyPairFromBytes, signBytes } from '@solana/kit'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- https://github.com/aklinker1/webext-core/pull/117
import { defineProxyService } from '@webext-core/proxy-service'

import { getDbService } from './db'

export const [registerSignService, getSignService] = defineProxyService('SignService', () => ({
  // TODO: What security measures should be in place here?
  signMessage: async (inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> => {
    const results: SolanaSignMessageOutput[] = []
    const active = await getDbService().wallet.active()
    if (!active.secretKey) {
      throw new Error('Active wallet has no secret key')
    }

    const bytes = new Uint8Array(JSON.parse(active.secretKey))
    const { privateKey } = await createKeyPairFromBytes(bytes)

    for (const input of inputs) {
      const messageBytes = new Uint8Array(Object.values(input.message))
      const signedBytes = await signBytes(privateKey, messageBytes)

      results.push({
        signature: signedBytes,
        signatureType: 'ed25519',
        signedMessage: messageBytes,
      })
    }

    return results
  },
}))
