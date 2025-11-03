import {
  address,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { useWalletAccountTransactionSigner } from '@solana/react'
import { getTransferSolInstruction } from '@solana-program/system'
import type { UiWalletAccount } from '@wallet-standard/react'
import { Button } from './ui/button.tsx'

interface SignTransactionProps {
  account: UiWalletAccount
}

const rpc = createSolanaRpc('https://api.devnet.solana.com')

const rpcSubscriptions = createSolanaRpcSubscriptions('ws://api.devnet.solana.com')

export function SignTransaction({ account }: SignTransactionProps) {
  const sender = useWalletAccountTransactionSigner(account, 'solana:devnet')

  return (
    <Button
      onClick={async () => {
        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
        const LAMPORTS_PER_SOL = 1_000_000_000n
        const transferAmount = lamports(LAMPORTS_PER_SOL / 100n) // 0.01 SOL
        const transferInstruction = getTransferSolInstruction({
          amount: transferAmount,
          destination: address('H2S3PxG5jtpJt6MCUyqbrz5TigW5M7zQgkEMmLsyacaT'),
          source: sender,
        })

        const transactionMessage = pipe(
          createTransactionMessage({ version: 0 }),
          (tx) => setTransactionMessageFeePayerSigner(sender, tx),
          (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
          (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
        )
        console.log('Transaction Message:', transactionMessage)

        const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
        console.log('Signed Transaction:', signedTransaction)

        await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
          // @ts-expect-error TODO: Figure out "Property lastValidBlockHeight is missing in type TransactionDurableNonceLifetime but required in type"
          signedTransaction,
          {
            commitment: 'confirmed',
          },
        )
        const transactionSignature = getSignatureFromTransaction(signedTransaction)
        console.log('Transaction Signature:', transactionSignature)
      }}
    >
      Sign Transaction
    </Button>
  )
}
