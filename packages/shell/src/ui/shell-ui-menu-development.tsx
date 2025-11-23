import { useSetting } from '@workspace/db-react/use-setting'
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@workspace/ui/components/menubar'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link } from 'react-router'

export function ShellUiMenuDevelopment({ items }: { items: { label: string; path: string }[] }) {
  const [developerMode] = useSetting('developerModeEnabled')
  return developerMode === 'true' ? (
    <MenubarMenu>
      <MenubarTrigger className="gap-2 h-8 md:h-12 px-2 md:px-4">
        <UiIcon className="size-4 md:size-6" icon="bug" />
      </MenubarTrigger>
      <MenubarContent>
        {items.map((item) => (
          <MenubarItem asChild key={item.label}>
            <Link to={item.path}>{item.label}</Link>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  ) : null
}
