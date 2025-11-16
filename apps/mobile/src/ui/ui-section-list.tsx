import { Link } from '@react-navigation/native'
import { LucideArrowRight } from 'lucide-react-native'
import type { ComponentType } from 'react'
import { SectionList, Text, useColorScheme, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { oklchToHex } from '../app-theme.tsx'

export interface UiSectionItem {
  label: string
  path: string
  icon: ComponentType<{ color: string }>
}

export function UiSectionList({ sections }: { sections: UiSectionItem[] }) {
  const scheme = useColorScheme()
  const iconColor = scheme === 'dark' ? oklchToHex(colors.neutral['100']) : oklchToHex(colors.neutral['900'])
  return (
    <SectionList
      keyExtractor={(item) => item.path}
      renderItem={({ item: { label, path, icon: Icon } }) => (
        <View className="p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
          <Link className="w-full" params={{}} screen={path}>
            <View className="flex flex-row items-center justify-between w-full">
              <View className="flex flex-row items-center gap-4">
                <Icon color={iconColor} />
                <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{label}</Text>
              </View>
              <View className="">
                <LucideArrowRight color={iconColor} />
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
