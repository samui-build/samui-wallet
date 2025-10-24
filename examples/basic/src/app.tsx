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
  type StandardConnectFeature,
  type StandardDisconnectFeature,
} from '@wallet-standard/core'
import { isSolanaChain } from '@solana/wallet-standard-chains'
import { getWalletFeature, useWallets, type UiWallet, type UiWalletAccount } from '@wallet-standard/react'
import { useState } from 'react'
import { Button } from './components/ui/button'
import {
  getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from '@wallet-standard/ui-registry'
import {
  address,
  getBase58Decoder,
  getPublicKeyFromAddress,
  getUtf8Encoder,
  signatureBytes,
  verifySignature,
} from '@solana/kit'

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

                  const { connect } = getWalletFeature(
                    wallet,
                    StandardConnect,
                  ) as StandardConnectFeature[typeof StandardConnect]

                  return (
                    <Button
                      key={feature}
                      onClick={async () => {
                        const response = await connect()

                        setAccount(
                          getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(
                            getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet),
                            response.accounts[0],
                          ),
                        )
                      }}
                    >
                      Connect
                    </Button>
                  )
                }

                case StandardDisconnect: {
                  if (!account) {
                    return null
                  }

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

                case SolanaSignAndSendTransaction: {
                  if (!account) {
                    return null
                  }

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
                  if (!account) {
                    return null
                  }

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
                  if (!account) {
                    return null
                  }

                  const { signMessage } = getWalletFeature(
                    wallet,
                    SolanaSignMessage,
                  ) as SolanaSignMessageFeature[typeof SolanaSignMessage]

                  return (
                    <Button
                      key={feature}
                      onClick={async () => {
                        const message = new Uint8Array(getUtf8Encoder().encode('Hello, World!'))
                        const [response] = await signMessage({
                          account,
                          message,
                        })
                        console.log('Signed Message:', response)

                        const decoded = getBase58Decoder().decode(response.signature)
                        console.log('Signature:', decoded)

                        const key = await getPublicKeyFromAddress(address(account.address))
                        const verified = await verifySignature(key, signatureBytes(response.signature), message)
                        console.log('Verified:', verified)
                      }}
                    >
                      Sign Message
                    </Button>
                  )
                }

                case SolanaSignIn: {
                  if (!account) {
                    return null
                  }

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
