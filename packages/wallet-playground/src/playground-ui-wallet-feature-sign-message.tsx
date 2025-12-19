import type { ReadonlyUint8Array } from '@solana/kit'
import { useWalletAccountMessageSigner } from '@solana/react'
import type { UiWallet, UiWalletAccount } from '@wallet-standard/react'
import { Button } from '@workspace/ui/components/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Spinner } from '@workspace/ui/components/spinner'
import { type Address, assertIsSignature, getBase64Decoder, type Signature } from 'gill'
import { LucideKey } from 'lucide-react'
import { type SyntheticEvent, useCallback, useState } from 'react'
import { getErrorMessage } from './playground-ui-error.tsx'

export function PlaygroundUiWalletFeatureSignMessage({
  account,
  onError,
  onSuccess,
}: {
  account: UiWalletAccount
  onError(err: unknown): void
  onSuccess(signature: Signature | undefined): void
  wallet: UiWallet
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState<string>('Hello Solana!')
  const messageSigner = useWalletAccountMessageSigner(account)

  const signMessage = useCallback(
    async (message: ReadonlyUint8Array) => {
      const [result] = await messageSigner.modifyAndSignMessages([
        {
          content: message as Uint8Array,
          signatures: {},
        },
      ])
      const signature = result?.signatures[account.address as Address]
      if (!signature) {
        throw new Error()
      }
      return signature as ReadonlyUint8Array
    },
    [account.address, messageSigner],
  )

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
          const signatureBytes = await signMessage(new TextEncoder().encode(text))
          const signature = getBase64Decoder().decode(signatureBytes)
          assertIsSignature(signature)
          onSuccess(signature)
        } catch (e) {
          console.log('e', e)
          onError(getErrorMessage(e, 'Unknown error occurred'))
        } finally {
          setIsLoading(false)
        }
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign Message</CardTitle>
          <CardDescription>Sign a Message with this text</CardDescription>
          <CardAction>
            <Button disabled={!text || isLoading} size="lg" type="submit" variant="outline">
              {isLoading ? <Spinner /> : <LucideKey />}
              Sign Message
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            onChange={(e: SyntheticEvent<HTMLInputElement>) => setText(e.currentTarget.value)}
            placeholder="Write a message to sign"
            value={text}
          />
        </CardContent>
      </Card>
    </form>
  )
}
