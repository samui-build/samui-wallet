import type { Mint } from '@solana-program/token-2022'
import type { Account } from '@solana/kit'

import { getTokenSize } from '@solana-program/token'
import { getTokenSize as getTokenSizeWithExtensions } from '@solana-program/token-2022'

import { getAccountExtensions } from './get-account-extentions'

/**
 * Returns the token size for a given mint account.
 *
 * @param {Account<Mint>} mint - The mint account to get the token size for.
 * @returns {number} The token size for the given mint account.
 */
export function getTokenSizeForMint(mint: Account<Mint>): number {
  const extensions = getAccountExtensions(mint.data)
  return extensions.length === 0 ? getTokenSize() : getTokenSizeWithExtensions(extensions)
}
