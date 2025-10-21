/*
 * From https://github.com/gillsdk/gill and adapted for Samui Wallet
 * MIT License
 * Copyright (c) 2023 Solana Foundation
 */
/**
 * Convert a lamport number to the human-readable string of a SOL value
 * @param lamports - The amount in lamports
 * @param decimals - Number of decimal places to show (default: 9, max: 9)
 */
export function lamportsToSol(lamports: bigint | number, decimals: number = 9): string {
  const maxDecimals = Math.min(decimals, 9)
  const solValue = Number(lamports) / 1_000_000_000
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  }).format(solValue)
}
