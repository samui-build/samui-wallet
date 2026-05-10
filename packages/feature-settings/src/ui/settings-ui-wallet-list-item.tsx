import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
import { Item, ItemActions, ItemContent, ItemTitle } from '@workspace/ui/components/item'
import { cn } from '@workspace/ui/lib/utils'
import { Link } from 'react-router'
import { SettingsUiWalletItem } from './settings-ui-wallet-item.tsx'
import { SettingsUiWalletMenu, type SettingsUiWalletMenuProps } from './settings-ui-wallet-menu.tsx'

export function SettingsUiWalletListItem({
  activeId,
  wallet,
  ...props
}: SettingsUiWalletMenuProps & { activeId: null | string }) {
  const { t } = useTranslation('settings')
  const protectionMode = wallet.protectionMode
  const protectionLabel = getProtectionModeLabel(protectionMode, {
    password: t(($) => $.walletProtectionPassword),
    pin: t(($) => $.walletProtectionPin),
    unsecured: t(($) => $.walletProtectionUnsecured),
  })

  return (
    <Item key={wallet.id} role="listitem" variant={activeId === wallet.id ? 'muted' : 'outline'}>
      <ItemContent className="min-w-0">
        <ItemTitle>
          <Link to={`./${wallet.id}`}>
            <SettingsUiWalletItem item={wallet} />
          </Link>
        </ItemTitle>
      </ItemContent>
      <ItemActions className="ml-auto shrink-0">
        <Badge
          className={cn('max-w-[140px] truncate md:max-w-none', getProtectionBadgeClassName(protectionMode))}
          title={protectionLabel}
          variant={getProtectionBadgeVariant(protectionMode)}
        >
          {protectionLabel}
        </Badge>
        <SettingsUiWalletMenu {...props} wallet={wallet} />
      </ItemActions>
    </Item>
  )
}

function getProtectionBadgeClassName(mode: Wallet['protectionMode']): string | undefined {
  switch (mode) {
    case 'password':
      return undefined
    case 'pin':
      return 'border-transparent bg-yellow-500 text-black'
    case 'unsecured':
      return undefined
  }
}

function getProtectionBadgeVariant(mode: Wallet['protectionMode']): 'destructive' | 'outline' | 'success' {
  switch (mode) {
    case 'password':
      return 'success'
    case 'pin':
      return 'outline'
    case 'unsecured':
      return 'destructive'
  }
}

function getProtectionModeLabel(
  mode: Wallet['protectionMode'],
  labels: Record<Wallet['protectionMode'], string>,
): string {
  return labels[mode]
}
