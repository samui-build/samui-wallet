import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { NetworkDeleteMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'

export function useNetworkDelete(props: NetworkDeleteMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsNetwork.delete(ctx, props))
}
