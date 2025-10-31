import type { Lamports } from '@solana/kit'

import { lamports } from '@solana/kit'

export const SOL_TRANSFER_FEE_LAMPORTS: Lamports = lamports(5000n)

/**
 * Calculates the maximum amount of SOL (in lamports) that can be sent
 * from an account, accounting for the transaction fee.
 @param availableBalance
 @returns
 */
export function maxAvailableSolAmount(availableBalance: bigint | string): Lamports {
  const balance = BigInt(availableBalance)

  // If the balance is less than or equal to the fee, they can't send anything.
  if (balance <= SOL_TRANSFER_FEE_LAMPORTS) {
    return lamports(0n)
  }

  // Otherwise, they can send their balance minus the fee.
  // We must cast the fee back to a bigint for the calculation.
  return lamports(balance - BigInt(SOL_TRANSFER_FEE_LAMPORTS))
}
