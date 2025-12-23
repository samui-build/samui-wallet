import { useNetworkLive } from './use-network-live.tsx'

export function useNetworkFindUnique({ id }: { id: string | undefined }) {
  const networks = useNetworkLive()
  return id ? (networks.find((network) => network.id === id) ?? null) : null
}
