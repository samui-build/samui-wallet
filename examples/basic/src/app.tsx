import { isSolanaChain } from '@solana/wallet-standard-chains'
import {
  SolanaSignAndSendTransaction,
  SolanaSignIn,
  SolanaSignMessage,
  SolanaSignTransaction,
} from '@solana/wallet-standard-features'
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core'
import { type UiWallet, type UiWalletAccount, useWallets } from '@wallet-standard/react'
import { useState } from 'react'
import { Connect } from './components/connect.tsx'
import { Disconnect } from './components/disconnect.tsx'
import { SignAndSendTransaction } from './components/sign-and-send-transaction.tsx'
import { SignIn } from './components/sign-in.tsx'
import { SignMessage } from './components/sign-message.tsx'
import { SignTransaction } from './components/sign-transaction.tsx'
import { Button } from './components/ui/button.tsx'

export function App() {
  const wallets = useWallets()
  const solanaWallets = wallets.filter(({ chains }) => chains.some((chain) => isSolanaChain(chain)))
  const [wallet, setWallet] = useState<UiWallet | undefined>(undefined)
  const [account, setAccount] = useState<UiWalletAccount | undefined>(undefined)

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Wallets</h1>

        {wallet ? (
          <div className="flex flex-col gap-4">
            {account ? (
              <div>
                <p>Wallet: {wallet.name}</p>
                <p>Account Address: {account.address}</p>
              </div>
            ) : null}
            {wallet.features.map((feature) => {
              switch (feature) {
                case StandardConnect: {
                  if (account) {
                    return null
                  }

                  return <Connect key={feature} setAccount={setAccount} wallet={wallet} />
                }

                case StandardDisconnect: {
                  if (!account) {
                    return null
                  }

                  return <Disconnect key={feature} setAccount={setAccount} wallet={wallet} />
                }

                case SolanaSignAndSendTransaction: {
                  if (!account) {
                    return null
                  }

                  return <SignAndSendTransaction account={account} key={feature} />
                }

                case SolanaSignTransaction: {
                  if (!account) {
                    return null
                  }

                  return <SignTransaction account={account} key={feature} />
                }

                case SolanaSignMessage: {
                  if (!account) {
                    return null
                  }

                  return <SignMessage account={account} key={feature} wallet={wallet} />
                }

                case SolanaSignIn: {
                  if (!account) {
                    return null
                  }

                  return <SignIn account={account} key={feature} wallet={wallet} />
                }

                default:
                  return null
              }
            })}
          </div>
        ) : solanaWallets.length ? (
          <div className="flex flex-col gap-4">
            {solanaWallets.map((wallet) => (
              <Button key={wallet.name} onClick={() => setWallet(wallet)}>
                {wallet.icon && <img alt={wallet.name} className="size-5" src={wallet.icon} />}
                <span className="text-left">{wallet.name}</span>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-xl text-white/70">No wallets found</p>
        )}
      </div>
    </div>
  )
}
