import { useWalletAccountTransactionSendingSigner } from '@solana/react'
import type { UiWallet, UiWalletAccount } from '@wallet-standard/react'
import type { Network } from '@workspace/db/network/network'
import { Button } from '@workspace/ui/components/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Spinner } from '@workspace/ui/components/spinner'
import {
  appendTransactionMessageInstruction,
  assertIsSignature,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  type Signature,
  type SolanaClient,
} from 'gill'
import { getAddMemoInstruction } from 'gill/programs'
import { LucideKey } from 'lucide-react'
import { type SyntheticEvent, useCallback, useState } from 'react'
import { getErrorMessage } from './playground-ui-error.tsx'

export function PlaygroundUiWalletFeatureSignAndSendTransaction({
  account,
  network,
  client,
  onError,
  onSuccess,
}: {
  client: SolanaClient
  network: Network
  account: UiWalletAccount
  onError(err: unknown): void
  onSuccess(signature: Signature | undefined): void
  wallet: UiWallet
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState<string>('Hello Solana!')
  const transactionSigner = useWalletAccountTransactionSendingSigner(account, network.type)

  const signTransaction = useCallback(async () => {
    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (m) => setTransactionMessageFeePayerSigner(transactionSigner, m),
      (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      (m) => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), m),
    )

    assertIsTransactionMessageWithSingleSendingSigner(message)
    const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
    const signature = getBase58Decoder().decode(signatureBytes)

    if (!signature) {
      throw new Error()
    }
    assertIsSignature(signature)
    return signature
  }, [client.rpc, text, transactionSigner])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
          const signature = await signTransaction()
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
          <CardTitle>Sign and Send Transaction</CardTitle>
          <CardDescription>Sign and Send a Transaction with a memo text</CardDescription>
          <CardAction>
            <Button disabled={!text || isLoading} size="lg" type="submit" variant="outline">
              {isLoading ? <Spinner /> : <LucideKey />}
              Sign Transaction
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            onChange={(e: SyntheticEvent<HTMLInputElement>) => setText(e.currentTarget.value)}
            placeholder="Write a memo text sign and send as transaction"
            value={text}
          />
        </CardContent>
      </Card>
    </form>
  )
}
