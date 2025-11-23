import { useQuery } from '@tanstack/react-query'
import type { WalletFindManyInput } from '@workspace/db/wallet/wallet-find-many-input'

import { optionsWallet } from './options-wallet.tsx'

export function useWalletFindMany({ input }: { input: WalletFindManyInput }) {
  return useQuery(optionsWallet.findMany(input))
}
