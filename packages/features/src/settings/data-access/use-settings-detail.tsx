import { useMemo } from 'react'
import { useSettings } from './settings-provider.js'

export function useSettingsDetail({ groupId }: { groupId: string }) {
  const { groups } = useSettings()

  return useMemo(() => {
    const group = groups.find((g) => g.id === groupId)

    if (!group) {
      throw new Error(`Group with id ${groupId} not found`)
    }

    return group
  }, [groups, groupId])
}
