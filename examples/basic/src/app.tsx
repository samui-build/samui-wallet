import {
  SolanaSignAndSendTransaction,
  SolanaSignIn,
  SolanaSignMessage,
  SolanaSignTransaction,
  type SolanaSignAndSendTransactionFeature,
  type SolanaSignInFeature,
  type SolanaSignMessageFeature,
  type SolanaSignTransactionFeature,
} from '@solana/wallet-standard-features'
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
  type StandardConnectFeature,
  type StandardDisconnectFeature,
  type StandardEventsFeature,
} from '@wallet-standard/core'
import { isSolanaChain } from '@solana/wallet-standard-chains'
import { getWalletFeature, useWallets, type UiWallet } from '@wallet-standard/react'
import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'

export function App() {
  const wallets = useWallets()
  const solanaWallets = wallets.filter(({ chains }) => chains.some((chain) => isSolanaChain(chain)))
  const [wallet, setWallet] = useState<UiWallet | undefined>(undefined)

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Wallets</h1>

        {wallet ? (
          <div className="flex flex-col gap-4">
            {wallet.features.map((feature) => {
              switch (feature) {
                case StandardConnect: {
                  const { connect } = getWalletFeature(
                    wallet,
                    StandardConnect,
                  ) as StandardConnectFeature[typeof StandardConnect]

                  return (
                    <Button key={feature} onClick={() => connect()}>
                      Connect
                    </Button>
                  )
                }

                case StandardDisconnect: {
                  const { disconnect } = getWalletFeature(
                    wallet,
                    StandardDisconnect,
                  ) as StandardDisconnectFeature[typeof StandardDisconnect]

                  return (
                    <Button key={feature} onClick={() => disconnect()}>
                      Disconnect
                    </Button>
                  )
                }

                case StandardEvents: {
                  const { on } = getWalletFeature(
                    wallet,
                    StandardEvents,
                  ) as StandardEventsFeature[typeof StandardEvents]

                  return (
                    <Button key={feature} onClick={() => on('change', console.log)}>
                      On
                    </Button>
                  )
                }

                case SolanaSignAndSendTransaction: {
                  const { signAndSendTransaction } = getWalletFeature(
                    wallet,
                    SolanaSignAndSendTransaction,
                  ) as SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction]

                  return (
                    <Button key={feature} onClick={() => signAndSendTransaction()}>
                      Sign & Send Transaction
                    </Button>
                  )
                }

                case SolanaSignTransaction: {
                  const { signTransaction } = getWalletFeature(
                    wallet,
                    SolanaSignTransaction,
                  ) as SolanaSignTransactionFeature[typeof SolanaSignTransaction]

                  return (
                    <Button key={feature} onClick={() => signTransaction()}>
                      Sign Transaction
                    </Button>
                  )
                }

                case SolanaSignMessage: {
                  const { signMessage } = getWalletFeature(
                    wallet,
                    SolanaSignMessage,
                  ) as SolanaSignMessageFeature[typeof SolanaSignMessage]

                  return (
                    <Button key={feature} onClick={() => signMessage()}>
                      Sign Message
                    </Button>
                  )
                }

                case SolanaSignIn: {
                  const { signIn } = getWalletFeature(wallet, SolanaSignIn) as SolanaSignInFeature[typeof SolanaSignIn]

                  return (
                    <Button key={feature} onClick={() => signIn()}>
                      Sign In
                    </Button>
                  )
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
                    {wallet.icon && <img src={wallet.icon} alt={wallet.name} className="size-5 object-contain" />}
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
