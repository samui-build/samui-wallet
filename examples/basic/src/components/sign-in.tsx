import { Button } from './ui/button'
import { getWalletFeature, type UiWallet, type UiWalletAccount } from '@wallet-standard/react'
import { SolanaSignIn, type SolanaSignInFeature } from '@solana/wallet-standard-features'
import { address, getBase58Decoder, getPublicKeyFromAddress, signatureBytes, verifySignature } from '@solana/kit'

interface SignInProps {
  wallet: UiWallet
  account: UiWalletAccount
}

export function SignIn({ wallet, account }: SignInProps) {
  const { signIn } = getWalletFeature(wallet, SolanaSignIn) as SolanaSignInFeature[typeof SolanaSignIn]

  return (
    <Button
      onClick={async () => {
        const [response] = await signIn({
          domain: 'example.com',
          address: account.address,
          statement: 'Sign in to Example App',
          uri: 'https://example.com',
          version: '1',
          chainId: 'solana:mainnet',
          nonce: '1234567890',
          issuedAt: '2023-10-25T12:00:00Z',
          expirationTime: '2023-10-25T13:00:00Z',
          notBefore: '2023-10-25T11:00:00Z',
          requestId: 'req-12345',
          resources: ['https://example.com/resource1', 'https://example.com/resource2'],
        })
        console.log('Signed Message:', response)

        const decoded = getBase58Decoder().decode(response.signature)
        console.log('Signature:', decoded)

        const key = await getPublicKeyFromAddress(address(account.address))
        const verified = await verifySignature(key, signatureBytes(response.signature), response.signedMessage)
        console.log('Verified:', verified)
      }}
    >
      Sign In
    </Button>
  )
}
