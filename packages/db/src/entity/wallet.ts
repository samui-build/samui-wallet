import { WalletType } from './wallet-type'

export interface Wallet {
  id: string
  createdAt: Date
  updatedAt: Date
  accountId: string
  name: string
  publicKey: string
  secretKey?: string
  type: WalletType
}
