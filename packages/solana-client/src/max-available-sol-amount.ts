import { TRANSACTION_FEE_LAMPORTS } from './constants'

export function maxAvailableSolAmount(available: bigint, requested: bigint): bigint {
  if (available < TRANSACTION_FEE_LAMPORTS) {
    return 0n
  }

  const maxSendable = available - TRANSACTION_FEE_LAMPORTS
  return requested < maxSendable ? requested : maxSendable
}
