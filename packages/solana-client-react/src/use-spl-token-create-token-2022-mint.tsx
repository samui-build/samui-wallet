import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import {
  type SplToken2022CreateTokenMintOptions,
  splToken2022CreateTokenMint,
} from '@workspace/solana-client/spl-token-2022-create-token-mint'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useSolanaClient } from './use-solana-client.tsx'

export function splTokenCreateToken2022MintMutationOptions(client: SolanaClient) {
  return mutationOptions({
    mutationFn: async (input: SplToken2022CreateTokenMintOptions) => splToken2022CreateTokenMint(client, input),
    onError: () => {
      toastError('Failed to create token 2022 mint.')
    },
    onSuccess: () => {
      toastSuccess('Token 2022 mint created successfully')
    },
  })
}

export function useSplTokenCreateToken2022Mint(props: { account: Account; network: Network }) {
  const client = useSolanaClient({ network: props.network })

  return useMutation(splTokenCreateToken2022MintMutationOptions(client))
}
