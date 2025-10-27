import type { ExtensionArgs, Mint } from '@solana-program/token-2022'

import { ExtensionType } from '@solana-program/token-2022'

/**
 * Builds the required account extensions for a given mint. This should only be used
 * for non-ATA token accounts since ATA accounts should also add the ImmutableOwner extension.
 *
 * https://github.com/solana-labs/solana-program-library/blob/3844bfac50990c1aa4dfb30f244f8c13178fc3fa/token/program-2022/src/extension/mod.rs#L1276
 *
 * @param {Mint} mint - The mint account to build extensions for.
 * @returns {ExtensionArgs[]} An array of extension arguments.
 */
export function getAccountExtensions(mint: Mint): ExtensionArgs[] {
  if (mint.extensions.__option === 'None') {
    return []
  }
  const extensions: ExtensionArgs[] = [
    {
      __kind: 'ImmutableOwner',
    },
  ]
  for (const extension of mint.extensions.value) {
    switch (extension.__kind) {
      case 'NonTransferable':
        extensions.push({
          __kind: 'NonTransferableAccount',
        })
        break
      case 'TransferFeeConfig':
        extensions.push({
          __kind: 'TransferFeeAmount',
          withheldAmount: 0n,
        })
        break
      case 'TransferHook':
        extensions.push({
          __kind: 'TransferHookAccount',
          transferring: false,
        })
        break
    }
  }
  return extensions
}

export function getTokenAccountExtensionType(mint: Mint): ExtensionType[] {
  if (mint.extensions.__option === 'None') {
    return []
  }
  const extensions: ExtensionType[] = [ExtensionType.ImmutableOwner]
  for (const extension of mint.extensions.value) {
    switch (extension.__kind) {
      case 'NonTransferable':
        extensions.push(ExtensionType.NonTransferableAccount)
        break
      case 'TransferFeeConfig':
        extensions.push(ExtensionType.TransferFeeAmount)
        break
      case 'TransferHook':
        extensions.push(ExtensionType.TransferHookAccount)
        break
    }
  }
  return extensions
}
