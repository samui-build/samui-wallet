import { useMutation } from '@tanstack/react-query'
import type { NetworkDeleteMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'

export function useNetworkDelete(props: NetworkDeleteMutateOptions = {}) {
  return useMutation(optionsNetwork.delete(props))
}
