import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { createAndSendSplTransaction } from '@workspace/solana-client/create-and-send-spl-transaction'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions } from '@workspace/solana-client-react/use-get-balance'
import { getTokenAccountsQueryOptions } from '@workspace/solana-client-react/use-get-token-accounts'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function useCreateAndSendSplTransaction(props: { network: Network }) {
  const { network } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network })

  return useMutation({
    mutationFn: async ({
      amount,
      decimals,
      destination,
      mint,
      account,
    }: {
      amount: string
      decimals: number
      destination: string
      mint: string
      account: Account
    }) => {
      if (!account.secretKey) {
        throw new Error(`No secret key for this account`)
      }
      const sender = await createKeyPairSignerFromJson({ json: account.secretKey })

      return createAndSendSplTransaction(client, { amount, decimals, destination, mint, sender })
    },
    onSuccess: (_, { account: { publicKey: address } }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getTokenAccountsQueryOptions({ address, client, network }).queryKey,
      })
    },
  })
}
