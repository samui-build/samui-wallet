import {
  SolanaSignAndSendTransaction,
  SolanaSignIn,
  SolanaSignMessage,
  SolanaSignTransaction,
} from '@solana/wallet-standard-features'
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core'
import { isSolanaChain } from '@solana/wallet-standard-chains'
import { useWallets, type UiWallet, type UiWalletAccount } from '@wallet-standard/react'
import { useState } from 'react'
import { Button } from './components/ui/button'
import { SignTransaction } from './components/sign-transaction'
import { Connect } from './components/connect'
import { Disconnect } from './components/disconnect'
import { SignAndSendTransaction } from './components/sign-and-send-transaction'
import { SignMessage } from './components/sign-message'
import { SignIn } from './components/sign-in'

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

                  return <Connect key={feature} wallet={wallet} setAccount={setAccount} />
                }

                case StandardDisconnect: {
                  if (!account) {
                    return null
                  }

                  return <Disconnect key={feature} wallet={wallet} setAccount={setAccount} />
                }

                case SolanaSignAndSendTransaction: {
                  if (!account) {
                    return null
                  }

                  return <SignAndSendTransaction key={feature} account={account} />
                }

                case SolanaSignTransaction: {
                  if (!account) {
                    return null
                  }

                  return <SignTransaction key={feature} account={account} />
                }

                case SolanaSignMessage: {
                  if (!account) {
                    return null
                  }

                  return <SignMessage key={feature} wallet={wallet} account={account} />
                }

                case SolanaSignIn: {
                  if (!account) {
                    return null
                  }

                  return <SignIn key={feature} wallet={wallet} account={account} />
                }

                default:
                  return null
              }
            })}
          </div>
        ) : (
          <>
            {solanaWallets.length ? (
              <div className="flex flex-col gap-4">
                {solanaWallets.map((wallet) => (
                  <Button key={wallet.name} onClick={() => setWallet(wallet)}>
                    {wallet.icon && <img src={wallet.icon} alt={wallet.name} className="size-5" />}
                    <span className="text-left">{wallet.name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-xl text-white/70">No wallets found</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
