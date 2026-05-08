import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { NetworkUpdateMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'

export function useNetworkUpdate(props: NetworkUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsNetwork.update(ctx, props))
}
