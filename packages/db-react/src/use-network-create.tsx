import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { NetworkCreateMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'

export function useNetworkCreate(props: NetworkCreateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsNetwork.create(ctx, props))
}
