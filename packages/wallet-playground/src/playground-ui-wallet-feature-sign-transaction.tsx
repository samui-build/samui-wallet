import { useWalletAccountTransactionSigner } from '@solana/react'
import type { UiWallet, UiWalletAccount } from '@wallet-standard/react'
import type { Network } from '@workspace/db/network/network'
import { Button } from '@workspace/ui/components/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Spinner } from '@workspace/ui/components/spinner'
import {
  appendTransactionMessageInstruction,
  assertIsSignature,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  type Signature,
  signTransactionMessageWithSigners,
  type SolanaClient,
} from 'gill'
import { getAddMemoInstruction } from 'gill/programs'
import { LucideKey } from 'lucide-react'
import { type SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { getErrorMessage } from './playground-ui-error.tsx'

export function PlaygroundUiWalletFeatureSignTransaction({
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
  const transactionSigner = useWalletAccountTransactionSigner(account, network.type)
  const sendAndConfirmTransaction = useMemo(() => sendAndConfirmTransactionFactory(client), [client])

  const signTransaction = useCallback(async () => {
    const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (m) => setTransactionMessageFeePayerSigner(transactionSigner, m),
      (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      (m) => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: text }), m),
    )

    const transaction = await signTransactionMessageWithSigners(message)
    assertIsTransactionWithBlockhashLifetime(transaction)
    const signature = getSignatureFromTransaction(transaction)
    await sendAndConfirmTransaction(transaction, { commitment: 'confirmed' })

    if (!signature) {
      throw new Error()
    }
    assertIsSignature(signature)
    return signature
  }, [client.rpc, text, transactionSigner, sendAndConfirmTransaction])

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
          <CardTitle>Sign Transaction</CardTitle>
          <CardDescription>Sign a Transaction with a memo text</CardDescription>
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
            placeholder="Write a memo text sign as transaction"
            value={text}
          />
        </CardContent>
      </Card>
    </form>
  )
}
