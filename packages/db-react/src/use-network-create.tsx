import { useMutation } from '@tanstack/react-query'
import type { NetworkCreateMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useNetworkCreate(props: NetworkCreateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsNetwork.create(ctx, props))
}
