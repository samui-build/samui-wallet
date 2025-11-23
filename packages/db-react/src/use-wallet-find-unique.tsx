import { useQuery } from '@tanstack/react-query'

import { optionsWallet } from './options-wallet.tsx'

export function useWalletFindUnique({ id }: { id: string }) {
  return useQuery(optionsWallet.findUnique(id))
}
