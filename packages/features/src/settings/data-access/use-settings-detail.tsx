import { useMemo } from 'react'
import { useSettings } from './settings-provider.js'

export function useSettingsDetail({ groupId, itemId }: { groupId: string; itemId: string }) {
  const { groups } = useSettings()

  return useMemo(() => {
    const group = groups.find((g) => g.id === groupId)
    const item = group?.items.find((i) => i.id === itemId)
    if (!group) {
      throw new Error(`Group with id ${groupId} not found`)
    }
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`)
    }
    return { group: { ...group, items: [] }, item }
  }, [groups, groupId, itemId])
}
