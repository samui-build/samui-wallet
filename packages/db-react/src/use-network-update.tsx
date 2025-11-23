import { useMutation } from '@tanstack/react-query'
import type { NetworkUpdateMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'

export function useNetworkUpdate(props: NetworkUpdateMutateOptions = {}) {
  return useMutation(optionsNetwork.update(props))
}
