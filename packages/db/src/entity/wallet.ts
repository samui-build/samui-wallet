import type { WalletType } from './wallet-type'

export interface Wallet {
  accountId: string
  createdAt: Date
  id: string
  name: string
  publicKey: string
  secretKey?: string
  type: WalletType
  updatedAt: Date
}
