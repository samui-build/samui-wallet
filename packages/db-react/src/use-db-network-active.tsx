import { useMemo } from 'react'
import { useDbNetworkLive } from './use-db-network-live.tsx'
import { useDbSetting } from './use-db-setting.tsx'

export function useDbNetworkActive() {
  const networkLive = useDbNetworkLive()
  const [activeId] = useDbSetting('activeNetworkId')
  const network = useMemo(() => networkLive.find((item) => item.id === activeId), [activeId, networkLive])
  if (!network) {
    throw new Error('No active network set.')
  }

  return network
}
