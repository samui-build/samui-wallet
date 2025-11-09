import type { Address } from '@solana/kit'

import { Effect } from 'effect'

import { convertKeyPairToJson } from './convert-key-pair-to-json.ts'
import { createKeyPairSignerFromBip44 } from './create-key-pair-signer-from-bip44.ts'
import { derivationPaths } from './derivation-paths.ts'

export interface DerivedAccount {
  publicKey: Address
  secretKey: string
}
export interface DeriveFromMnemonicAtIndexProps {
  derivationIndex?: number
  derivationPath?: string
  mnemonic: string
}

export async function deriveFromMnemonicAtIndex({
  derivationIndex = 0,
  derivationPath = derivationPaths.default,
  mnemonic,
}: DeriveFromMnemonicAtIndexProps): Promise<DerivedAccount> {
  const result = Effect.tryPromise({
    catch: (error) => {
      if (error instanceof Error && error.message.includes('Invalid mnemonic')) {
        throw error
      }
      throw new Error(`Error creating KeyPair signer from mnemonic`)
    },
    try: () =>
      createKeyPairSignerFromBip44({
        derivationPath,
        extractable: true,
        from: derivationIndex,
        mnemonic,
        to: derivationIndex + 1,
      }),
  })
  const signers = await Effect.runPromise(result)

  const signer = signers.length ? signers[0] : undefined
  if (!signer) {
    throw new Error(`Error creating KeyPair signer from mnemonic`)
  }

  const secretKey = await convertKeyPairToJson(signer.keyPair)

  return {
    publicKey: signer.address,
    secretKey,
  }
}
