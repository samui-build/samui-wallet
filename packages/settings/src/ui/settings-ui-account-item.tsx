import type { Account } from '@workspace/db/account/account'
import { ExplorerUiLinkAddress } from '@workspace/explorer/ui/explorer-ui-link-address'
import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { getColorForName } from '@workspace/ui/lib/get-initials-colors'
import { getAccountUiIcon } from './account-ui-icon.tsx'

export function SettingsUiAccountItem({ item }: { item: Account }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <UiAvatar color={getColorForName(item.type)} icon={getAccountUiIcon(item.type)} label={item.name} />
      <div className="flex w-full flex-col">
        <div className="font-bold">{item.name}</div>
        <ExplorerUiLinkAddress address={item.publicKey} basePath="/explorer" className="text-xs" />
      </div>
    </div>
  )
}
