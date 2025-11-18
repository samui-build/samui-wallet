/*
 * From https://github.com/anza-xyz/kit and adapted for Samui Wallet
 * MIT License
 * Copyright (c) 2023 Solana Labs, Inc
 */
import type { Lamports } from '@solana/kit'
import { lamports } from '@solana/kit'
import { uiAmountToBigInt } from './ui-amount-to-big-int.ts'

export function solToLamports(amount: string): Lamports {
  const bigIntLamports = uiAmountToBigInt(amount, 9)
  return lamports(bigIntLamports)
}
