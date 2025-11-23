import { useMutation } from '@tanstack/react-query'
import type { NetworkCreateMutateOptions } from './options-network.tsx'
import { optionsNetwork } from './options-network.tsx'

export function useNetworkCreate(props: NetworkCreateMutateOptions = {}) {
  return useMutation(optionsNetwork.create(props))
}
