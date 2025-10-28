import { Button } from './ui/button'
import { getWalletFeature, type UiWallet } from '@wallet-standard/react'
import {
  SolanaSignAndSendTransaction,
  type SolanaSignAndSendTransactionFeature,
} from '@solana/wallet-standard-features'

interface SignAndSendTransactionProps {
  wallet: UiWallet
}

export function SignAndSendTransaction({ wallet }: SignAndSendTransactionProps) {
  const { signAndSendTransaction } = getWalletFeature(
    wallet,
    SolanaSignAndSendTransaction,
  ) as SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction]

  return <Button onClick={() => signAndSendTransaction()}>Sign & Send Transaction</Button>
}
