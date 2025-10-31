import type { Wallet } from '@workspace/db/entity/wallet'

import { useMutation } from '@tanstack/react-query'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'

import type { ClusterWallet } from './portfolio-routes-loaded.js'

export function useCreateAndSendSolTransaction(
  props: {
    onError?: (error: Error) => void
  } & ClusterWallet,
) {
  const client = useSolanaClient({ cluster: props.cluster })

  return useMutation({
    mutationFn: async ({
      amount,
      balance,
      destination,
      wallet,
    }: {
      amount: string
      balance: bigint | string
      destination: string
      wallet: Wallet
    }) => {
      if (!wallet.secretKey) {
        throw new Error(`No secret key for this wallet`)
      }
      const sender = await createKeyPairSignerFromJson({ json: wallet.secretKey })

      try {
        const signature = await createAndSendSolTransaction(client, {
          amount,
          destination,
          sender,
          senderBalance: String(balance),
        })
        return signature
      } catch (error) {
        if (props.onError && error instanceof Error) {
          props.onError(error)
        }
        throw error
      }
    },
  })
}
