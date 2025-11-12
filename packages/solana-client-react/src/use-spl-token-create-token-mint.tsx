import { useMutation } from '@tanstack/react-query'
import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import type { SplTokenCreateTokenMintOptions } from '@workspace/solana-client/spl-token-create-token-mint'
import { splTokenCreateTokenMint } from '@workspace/solana-client/spl-token-create-token-mint'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { useSolanaClient } from './use-solana-client.tsx'

export function useSplTokenCreateTokenMint(props: { account: Account; network: Network }) {
  const client = useSolanaClient({ network: props.network })

  return useMutation({
    mutationFn: async (input: Omit<SplTokenCreateTokenMintOptions, 'feePayer'>) => {
      if (!props.account.secretKey) {
        throw new Error('Missing account secret key')
      }
      const feePayer = await createKeyPairSignerFromJson({ json: props.account.secretKey })
      return splTokenCreateTokenMint(client, { ...input, feePayer })
    },
    onError: () => {
      toastError('Failed to create token mint.')
    },
    onSuccess: () => {
      toastSuccess('Token mint created successfully')
    },
  })
}
