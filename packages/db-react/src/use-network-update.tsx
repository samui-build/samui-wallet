import { useMutation } from '@tanstack/react-query'
import type { NetworkUpdateMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useNetworkUpdate(props: NetworkUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsNetwork.update(ctx, props))
}
