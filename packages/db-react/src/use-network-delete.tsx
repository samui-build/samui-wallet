import { useMutation } from '@tanstack/react-query'
import type { NetworkDeleteMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useNetworkDelete(props: NetworkDeleteMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsNetwork.delete(ctx, props))
}
