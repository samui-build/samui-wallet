/// <reference lib="webworker" />

import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'
import { convertKeyPairToJson } from '@workspace/keypair/convert-key-pair-to-json'

type VanityWorkerInput = {
  caseSensitive?: boolean
  prefix?: string
  suffix?: string
}

type VanityWorkerMessage =
  | { payload: number; type: 'progress' }
  | { payload: { address: string; attempts: number; secretKey: string }; type: 'found' }
  | { payload: string; type: 'error' }

const PROGRESS_INTERVAL = 1000
const MAX_ATTEMPTS = 20_000_000

self.onmessage = async (event: MessageEvent<VanityWorkerInput>) => {
  const { caseSensitive = true, prefix = '', suffix = '' } = event.data ?? {}
  const sanitizedPrefix = prefix.trim().slice(0, 4)
  const sanitizedSuffix = suffix.trim().slice(0, 4)
  const hasPrefix = sanitizedPrefix.length > 0
  const hasSuffix = sanitizedSuffix.length > 0

  if (!hasPrefix && !hasSuffix) {
    const errorMessage: VanityWorkerMessage = {
      payload: 'Enter a prefix or suffix',
      type: 'error',
    }
    self.postMessage(errorMessage)
    return
  }

  const normalizedPrefix = caseSensitive ? sanitizedPrefix : sanitizedPrefix.toLowerCase()
  const normalizedSuffix = caseSensitive ? sanitizedSuffix : sanitizedSuffix.toLowerCase()

  let attempts = 0

  try {
    while (attempts < MAX_ATTEMPTS) {
      const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32))
      const signer = await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes, true)
      const addressToCheck = caseSensitive ? signer.address : signer.address.toLowerCase()

      let match = true
      if (normalizedPrefix) {
        match = addressToCheck.startsWith(normalizedPrefix)
      }
      if (match && normalizedSuffix) {
        match = addressToCheck.endsWith(normalizedSuffix)
      }

      attempts += 1

      if (attempts === 1 || attempts % PROGRESS_INTERVAL === 0) {
        const progressMessage: VanityWorkerMessage = { payload: attempts, type: 'progress' }
        self.postMessage(progressMessage)
      }

      if (match) {
        const secretKey = await convertKeyPairToJson(signer.keyPair)
        const foundMessage: VanityWorkerMessage = {
          payload: {
            address: signer.address,
            attempts,
            secretKey,
          },
          type: 'found',
        }
        self.postMessage(foundMessage)
        return
      }
    }

    const exhaustedMessage: VanityWorkerMessage = {
      payload: 'No vanity match found within 20000000 attempts, try a shorter pattern',
      type: 'error',
    }
    self.postMessage(exhaustedMessage)
  } catch (error) {
    const errorMessage: VanityWorkerMessage = {
      payload: error instanceof Error ? error.message : 'Unknown worker error',
      type: 'error',
    }
    self.postMessage(errorMessage)
  }
}
