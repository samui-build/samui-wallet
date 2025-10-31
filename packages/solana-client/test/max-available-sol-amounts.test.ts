import { lamports } from '@solana/kit'
import { describe, expect, it } from 'vitest'

import { maxAvailableSolAmount, SOL_TRANSFER_FEE_LAMPORTS } from '../src/max-available-sol-amount'

describe('maxAvailableSolAmount', () => {
  // Get the fee (which is 5000n lamports)
  const fee = SOL_TRANSFER_FEE_LAMPORTS

  it('should return 0n lamports if balance is less than the fee', () => {
    const result = maxAvailableSolAmount('1000')
    expect(result).toBe(lamports(0n))
  })

  it('should return 0n lamports if balance is equal to the fee', () => {
    // Pass in the fee as a string or bigint, both should work
    const result = maxAvailableSolAmount(String(fee))
    expect(result).toBe(lamports(0n))
  })

  it('should return (balance - fee) if balance is greater than the fee', () => {
    const balance = 1_000_000n
    // We must cast the Lamports-branded fee back to a BigInt for subtraction
    const expected = lamports(balance - BigInt(fee))
    const result = maxAvailableSolAmount(balance)

    expect(result).toBe(expected)
    expect(result).toBe(lamports(995000n))
  })

  it('should return 0n lamports for zero balance', () => {
    const result = maxAvailableSolAmount('0')
    expect(result).toBe(lamports(0n))
  })
})
