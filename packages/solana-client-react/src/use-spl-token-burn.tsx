import { mutationOptions, useMutation } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import type { SplTokenBurnOptions } from '@workspace/solana-client/spl-token-burn'
import { splTokenBurn } from '@workspace/solana-client/spl-token-burn'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useSolanaClient } from './use-solana-client.tsx'

export function splTokenBurnMutationOptions(client: SolanaClient) {
  return mutationOptions({
    mutationFn: async (input: SplTokenBurnOptions) => {
      return splTokenBurn(client, input)
    },
    onError: () => {
      toastError('Failed to burn token.')
    },
    onSuccess: () => {
      toastSuccess('Token burned successfully')
    },
  })
}

export function useSplTokenBurn(props: { network: Network }) {
  const client = useSolanaClient({ network: props.network })

  return useMutation(splTokenBurnMutationOptions(client))
}
