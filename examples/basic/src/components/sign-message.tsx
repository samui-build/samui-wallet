import { Button } from './ui/button'
import { getWalletFeature, type UiWallet, type UiWalletAccount } from '@wallet-standard/react'
import { SolanaSignMessage, type SolanaSignMessageFeature } from '@solana/wallet-standard-features'
import {
  address,
  getBase58Decoder,
  getPublicKeyFromAddress,
  getUtf8Encoder,
  signatureBytes,
  verifySignature,
} from '@solana/kit'

interface SignMessageProps {
  wallet: UiWallet
  account: UiWalletAccount
}

export function SignMessage({ wallet, account }: SignMessageProps) {
  const { signMessage } = getWalletFeature(
    wallet,
    SolanaSignMessage,
  ) as SolanaSignMessageFeature[typeof SolanaSignMessage]

  return (
    <Button
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
