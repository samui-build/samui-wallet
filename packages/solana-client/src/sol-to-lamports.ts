/*
 * From https://github.com/anza-xyz/kit and adapted for Samui Wallet
 * MIT License
 * Copyright (c) 2023 Solana Labs, Inc
 */
import type { Lamports } from '@solana/kit'

import { lamports } from '@solana/kit'

export function solToLamports(amount: string): Lamports {
  if (Number.isNaN(parseFloat(amount))) {
    throw new Error(`Could not parse token quantity: ${String(amount)}`)
  }
  const formatter = new Intl.NumberFormat('en-US', { useGrouping: false })
  const bigIntLamports = BigInt(
    // @ts-expect-error - scientific notation is supported by `Intl.NumberFormat` but the types are wrong
    formatter.format(`${amount}E9`).split('.')[0],
  )
  return lamports(bigIntLamports)
}
