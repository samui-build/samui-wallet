import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@workspace/ui/components/menubar'
import { LucideBug } from 'lucide-react'
import { Link } from 'react-router'

export function ShellUiMenuDevelopment({ items }: { items: { label: string; path: string }[] }) {
  const [developerMode] = useDbPreference('developerModeEnabled')
  return developerMode === 'true' ? (
    <MenubarMenu>
      <MenubarTrigger className="gap-2 h-8 md:h-12 px-2 md:px-4">
        <LucideBug className="size-4 md:size-6" />
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
