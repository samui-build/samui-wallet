import type { Address } from '@solana/kit'

import { tryCatch } from '@workspace/core/try-catch'

import { convertKeyPairToJson } from './convert-key-pair-to-json'
import { createKeyPairSignerFromBip44 } from './create-key-pair-signer-from-bip44'
import { derivationPaths } from './derivation-paths'

export interface DerivedWallet {
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
}: DeriveFromMnemonicAtIndexProps): Promise<DerivedWallet> {
  const { data: signers, error } = await tryCatch(
    createKeyPairSignerFromBip44({
      derivationPath,
      extractable: true,
      from: derivationIndex,
      mnemonic,
      to: derivationIndex + 1,
    }),
  )
  if (error) {
    if (error instanceof Error && error.message.includes('Invalid mnemonic')) {
      throw error
    }
    throw new Error(`Error creating KeyPair signer from mnemonic`)
  }
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
