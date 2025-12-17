import type { Address } from '@solana/kit'

export interface TransferRecipient {
  amount: bigint
  destination: Address
}
