import { useMemo } from 'react'
import { useNetworkLive } from './use-network-live.tsx'
import { useSetting } from './use-setting.tsx'

export function useNetworkActive() {
  const networkLive = useNetworkLive()
  const [activeId] = useSetting('activeNetworkId')
  const network = useMemo(() => networkLive.find((item) => item.id === activeId), [activeId, networkLive])
  if (!network) {
    throw new Error('No active network set.')
  }

  return network
}
