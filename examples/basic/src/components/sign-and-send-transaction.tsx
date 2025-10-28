import { useWalletAccountTransactionSendingSigner } from '@solana/react'
import { type UiWalletAccount } from '@wallet-standard/react'
import { Button } from './ui/button'
import {
  address,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createTransactionMessage,
  getBase58Decoder,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'

interface SignAndSendTransactionProps {
  account: UiWalletAccount
}

const rpc = createSolanaRpc('https://api.devnet.solana.com')

export function SignAndSendTransaction({ account }: SignAndSendTransactionProps) {
  const sender = useWalletAccountTransactionSendingSigner(account, 'solana:devnet')

  return (
    <Button
      onClick={async () => {
        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
        const LAMPORTS_PER_SOL = 1_000_000_000n
        const transferAmount = lamports(LAMPORTS_PER_SOL / 100n) // 0.01 SOL
        const transferInstruction = getTransferSolInstruction({
          source: sender,
          destination: address('H2S3PxG5jtpJt6MCUyqbrz5TigW5M7zQgkEMmLsyacaT'),
          amount: transferAmount,
        })

        const transactionMessage = pipe(
          createTransactionMessage({ version: 0 }),
          (tx) => setTransactionMessageFeePayerSigner(sender, tx),
          (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
          (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
        )
        console.log('Transaction Message:', transactionMessage)

        const signature = await signAndSendTransactionMessageWithSigners(transactionMessage)
        console.log('Transaction Signature:', signature)

        const decodedSignature = getBase58Decoder().decode(signature)
        console.log('Decoded Signature:', decodedSignature)
      }}
    >
      Sign and Send Transaction
    </Button>
  )
}
