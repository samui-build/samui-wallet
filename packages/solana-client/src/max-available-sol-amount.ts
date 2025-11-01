const TRANSACTION_FEE_LAMPORTS = 5000

/**
 * Calculate the maximum available SOL amount that can be sent
 * @param available - Available balance in lamports
 * @param requested - Requested amount to send in lamports
 * @returns
 */
export function maxAvailableSolAmount(available: bigint, requested: bigint): bigint {
  if (available < TRANSACTION_FEE_LAMPORTS) {
    return 0n
  }

  const maxSendable = available - BigInt(TRANSACTION_FEE_LAMPORTS)
  return requested < maxSendable ? requested : maxSendable
}
