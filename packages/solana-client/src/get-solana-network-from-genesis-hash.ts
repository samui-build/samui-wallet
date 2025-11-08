/*
 * From https://github.com/gillsdk/gill and adapted for Samui Wallet
 * MIT License
 * Copyright (c) 2023 Solana Foundation
 */
import type { SolanaNetwork } from './solana-network.ts'

export const GENESIS_HASH = {
  devnet: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
  mainnet: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
  testnet: '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY',
}
/**
 * Determine the Solana Network from its genesis hash
 */
export function getSolanaNetworkFromGenesisHash(hash: string): SolanaNetwork {
  switch (hash) {
    case GENESIS_HASH.devnet:
      return 'solana:devnet'
    case GENESIS_HASH.mainnet:
      return 'solana:mainnet'
    case GENESIS_HASH.testnet:
      return 'solana:testnet'
    default:
      return 'solana:localnet'
  }
}
