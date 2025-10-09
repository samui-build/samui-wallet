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

export function App() {
  const wallets = useWallets()
  const solanaWallets = wallets.filter(({ chains }) => chains.some((chain) => isSolanaChain(chain)))
  const [wallet, setWallet] = useState<UiWallet | undefined>(undefined)
  console.log('Solana wallets:', solanaWallets)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Wallets
        </h1>

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
                    <button
                      key={feature}
                      onClick={() => connect()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Connect
                    </button>
                  )
                }

                case StandardDisconnect: {
                  const { disconnect } = getWalletFeature(
                    wallet,
                    StandardDisconnect,
                  ) as StandardDisconnectFeature[typeof StandardDisconnect]

                  return (
                    <button
                      key={feature}
                      onClick={() => disconnect()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Disconnect
                    </button>
                  )
                }

                case StandardEvents: {
                  const { on } = getWalletFeature(
                    wallet,
                    StandardEvents,
                  ) as StandardEventsFeature[typeof StandardEvents]

                  return (
                    <button
                      key={feature}
                      onClick={() => on('change', console.log)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      On
                    </button>
                  )
                }

                case SolanaSignAndSendTransaction: {
                  const { signAndSendTransaction } = getWalletFeature(
                    wallet,
                    SolanaSignAndSendTransaction,
                  ) as SolanaSignAndSendTransactionFeature[typeof SolanaSignAndSendTransaction]

                  return (
                    <button
                      key={feature}
                      onClick={() => signAndSendTransaction()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Sign & Send Transaction
                    </button>
                  )
                }

                case SolanaSignTransaction: {
                  const { signTransaction } = getWalletFeature(
                    wallet,
                    SolanaSignTransaction,
                  ) as SolanaSignTransactionFeature[typeof SolanaSignTransaction]

                  return (
                    <button
                      key={feature}
                      onClick={() => signTransaction()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Sign Transaction
                    </button>
                  )
                }

                case SolanaSignMessage: {
                  const { signMessage } = getWalletFeature(
                    wallet,
                    SolanaSignMessage,
                  ) as SolanaSignMessageFeature[typeof SolanaSignMessage]

                  return (
                    <button
                      key={feature}
                      onClick={() => signMessage()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Sign Message
                    </button>
                  )
                }

                case SolanaSignIn: {
                  const { signIn } = getWalletFeature(wallet, SolanaSignIn) as SolanaSignInFeature[typeof SolanaSignIn]

                  return (
                    <button
                      key={feature}
                      onClick={() => signIn()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Sign In
                    </button>
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
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {solanaWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => setWallet(wallet)}
                    className="flex items-center gap-4 p-6 bg-white/10 border border-white/20 rounded-2xl text-white text-lg font-medium cursor-pointer transition-all backdrop-blur-md shadow-xl"
                  >
                    {wallet.icon && (
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        width={32}
                        height={32}
                        className="rounded-lg flex-shrink-0"
                      />
                    )}
                    <span className="text-left">{wallet.name}</span>
                  </button>
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
