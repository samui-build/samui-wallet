import { Link } from '@react-navigation/native'
import { SectionList, Text, View } from 'react-native'
import { UiIcon } from './ui-icon.tsx'
import type { UiIconName } from './ui-icon-map.tsx'

export interface UiSectionItem {
  label: string
  path: string
  icon: UiIconName
}

export function UiSectionList({ sections }: { sections: UiSectionItem[] }) {
  return (
    <SectionList
      keyExtractor={(item) => item.path}
      renderItem={({ item: { label, path, icon } }) => (
        <View className="bg-neutral-50 p-4 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
          <Link className="w-full" params={{}} screen={path}>
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-4 text-foreground dark:text-white">
                <UiIcon icon={icon} />
                <Text className="font-bold text-lg text-neutral-900 dark:text-neutral-100">{label}</Text>
              </View>
              <View>
                <UiIcon icon="chevronRight" />
              </View>
            </View>
          </Link>
        </View>
      )}
      sections={[
        {
          data: sections,
          ItemSeparatorComponent,
          key: 'main',
        },
      ]}
    />
  )
}

function ItemSeparatorComponent() {
  return <View className="p-2" />
}
