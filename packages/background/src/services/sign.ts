import type {
  SolanaSignInInput,
  SolanaSignInOutput,
  SolanaSignMessageInput,
  SolanaSignMessageOutput,
  SolanaSignTransactionInput,
  SolanaSignTransactionOutput,
} from '@solana/wallet-standard-features'

import {
  createKeyPairFromBytes,
  getTransactionDecoder,
  getTransactionEncoder,
  signBytes,
  signTransaction,
} from '@solana/kit'
import { createSignInMessage } from '@solana/wallet-standard-util'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- https://github.com/aklinker1/webext-core/pull/117
import { defineProxyService } from '@webext-core/proxy-service'
import { ensureUint8Array } from '@workspace/keypair/ensure-uint8array'

import { getDbService } from './db'

// TODO: None of this code is safe for production use.
// Private keys should not be handled in this way.
// We are not verifying any input.
// We are not validating any output.
// We are not handling errors.
// Nothing about this code should be trusted.
// This is acceptable for a POC
// This will be improved post-hackathon.
export const [registerSignService, getSignService] = defineProxyService('SignService', () => ({
  signIn: async (inputs: SolanaSignInInput[]): Promise<SolanaSignInOutput[]> => {
    const results: SolanaSignInOutput[] = []
    const active = await getDbService().wallet.active()
    const wallets = await getDbService().wallet.walletAccounts()
    if (!active.secretKey) {
      throw new Error('Active wallet has no secret key')
    }

    const bytes = new Uint8Array(JSON.parse(active.secretKey))
    const { privateKey } = await createKeyPairFromBytes(bytes)

    for (const input of inputs) {
      const signedMessage = createSignInMessage({
        ...input,
        address: input.address || active.publicKey,
        domain: input.domain || window.location.hostname,
      })
      const signature = await signBytes(privateKey, signedMessage)

      results.push({
        account: wallets.accounts[0],
        signature,
        signatureType: 'ed25519',
        signedMessage,
      })
    }

    return results
  },
  signMessage: async (inputs: SolanaSignMessageInput[]): Promise<SolanaSignMessageOutput[]> => {
    const results: SolanaSignMessageOutput[] = []
    const active = await getDbService().wallet.active()
    if (!active.secretKey) {
      throw new Error('Active wallet has no secret key')
    }

    const bytes = new Uint8Array(JSON.parse(active.secretKey))
    const { privateKey } = await createKeyPairFromBytes(bytes)

    for (const input of inputs) {
      const signedMessage = ensureUint8Array(input.message)
      const signature = await signBytes(privateKey, signedMessage)

      results.push({
        signature,
        signatureType: 'ed25519',
        signedMessage,
      })
    }

    return results
  },
  signTransaction: async (inputs: SolanaSignTransactionInput[]): Promise<SolanaSignTransactionOutput[]> => {
    const results: SolanaSignTransactionOutput[] = []
    const active = await getDbService().wallet.active()
    if (!active.secretKey) {
      throw new Error('Active wallet has no secret key')
    }

    const bytes = new Uint8Array(JSON.parse(active.secretKey))
    const key = await createKeyPairFromBytes(bytes)

    for (const input of inputs) {
      const decoded = getTransactionDecoder().decode(ensureUint8Array(input.transaction))
      // @ts-expect-error TODO: Figure out "Property 'lifetimeConstraint' is missing in type 'Readonly<{ messageBytes: TransactionMessageBytes; signatures: SignaturesMap; }>' but required in type 'TransactionWithLifetime'."
      const signed = await signTransaction([key], decoded)
      results.push({
        signedTransaction: new Uint8Array(getTransactionEncoder().encode(signed)),
      })
    }

    return results
  },
}))
