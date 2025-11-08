import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '@workspace/db/entity/account'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import { createAndSendSolTransaction } from '@workspace/solana-client/create-and-send-sol-transaction'
import { solToLamports } from '@workspace/solana-client/sol-to-lamports'
import { getAccountInfoQueryOptions } from '@workspace/solana-client-react/use-get-account-info'
import { getBalanceQueryOptions, useGetBalance } from '@workspace/solana-client-react/use-get-balance'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

import type { AccountNetwork } from './portfolio-routes-loaded.tsx'

export function useCreateAndSendSolTransaction(props: AccountNetwork) {
  const { account, network } = props
  const queryClient = useQueryClient()
  const client = useSolanaClient({ network: props.network })
  const { data: balanceData } = useGetBalance({ address: account.publicKey, network })

  return useMutation({
    mutationFn: async ({ account, amount, destination }: { account: Account; amount: string; destination: string }) => {
      if (!account.secretKey) {
        throw new Error(`No secret key for this account`)
      }

      const sender = await createKeyPairSignerFromJson({ json: account.secretKey })

      if (!balanceData?.value) {
        throw new Error('Balance not available')
      }

      return createAndSendSolTransaction(client, {
        amount: solToLamports(amount),
        destination,
        sender,
        senderBalance: balanceData.value,
      })
    },
    onSuccess: (_, { account: { publicKey: address } }) => {
      queryClient.invalidateQueries({
        queryKey: getBalanceQueryOptions({ address, client, network }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: getAccountInfoQueryOptions({ address, client, network }).queryKey,
      })
    },
  })
}
