import { useMutation } from '@tanstack/react-query'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'
import { createKeyPairSignerFromJson } from '@workspace/keypair/create-key-pair-signer-from-json'
import type { SplTokenCreateTokenMintOptions } from '@workspace/solana-client/spl-token-create-token-mint'
import { splTokenCreateTokenMint } from '@workspace/solana-client/spl-token-create-token-mint'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

import { useSolanaClient } from './use-solana-client.tsx'

export function useSplTokenCreateTokenMint(props: { cluster: Cluster; wallet: Wallet }) {
  const client = useSolanaClient({ cluster: props.cluster })

  return useMutation({
    mutationFn: async (input: Omit<SplTokenCreateTokenMintOptions, 'feePayer'>) => {
      if (!props.wallet.secretKey) {
        throw new Error('Missing wallet secret key')
      }
      const feePayer = await createKeyPairSignerFromJson({ json: props.wallet.secretKey })
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
