import { useNetworkLive } from './use-network-live.tsx'

export function useNetworkFindUnique({ id }: { id: string }) {
  const networks = useNetworkLive()
  return networks.find((network) => network.id === id) ?? null
}
