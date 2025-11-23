import type { Account } from '@workspace/db/account/account'
import type { Wallet } from '@workspace/db/wallet/wallet'
import { useTranslation } from '@workspace/i18n'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@workspace/ui/components/menubar'
import { UiAvatar } from '@workspace/ui/components/ui-avatar'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiTextCopyButton } from '@workspace/ui/components/ui-text-copy-button'
import { cn } from '@workspace/ui/lib/utils'
import { Link } from 'react-router'

export function ShellUiMenuWallets({
  wallets,
  activeAccount,
  activeWallet,
  setActiveAccount,
}: {
  activeAccount: Account
  activeWallet: Wallet
  setActiveAccount: (id: string) => Promise<void>
  wallets: Wallet[]
}) {
  const { t } = useTranslation('shell')
  return (
    <MenubarMenu>
      <MenubarTrigger asChild className="py-2 gap-2 h-8 md:h-12 px-1 md:px-2 md:min-w-[150px]">
        <div className="flex items-center gap-2">
          <UiAvatar className="size-6 md:size-8" label={activeWallet.name} />
          {activeAccount.name}
          <UiTextCopyButton
            onPointerDown={(e) => e.stopPropagation()}
            size="icon"
            text={activeAccount.publicKey}
            title={t(($) => $.accountPublicKeyCopy)}
            toast={t(($) => $.accountPublicKeyCopySuccess)}
            toastFailed={t(($) => $.accountPublicKeyCopyFailed)}
            variant="ghost"
          />
        </div>
      </MenubarTrigger>
      <MenubarContent>
        {wallets.map((wallet) => (
          <MenubarSub key={wallet.id}>
            <MenubarSubTrigger className="gap-2">
              <UiAvatar label={wallet.name} />
              {wallet.name}
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup onValueChange={(id) => setActiveAccount(id)} value={activeAccount.id}>
                {wallet.accounts.map((account) => (
                  <div className="flex items-center" key={account.id}>
                    <MenubarRadioItem
                      className={cn('font-mono', {
                        'font-bold': account.id === activeAccount.id,
                      })}
                      value={account.id}
                    >
                      {account.name}
                    </MenubarRadioItem>
                    <UiTextCopyButton
                      size="icon"
                      text={account.publicKey}
                      title={t(($) => $.accountPublicKeyCopy)}
                      toast={t(($) => $.accountPublicKeyCopySuccess)}
                      toastFailed={t(($) => $.accountPublicKeyCopyFailed)}
                      variant="ghost"
                    />
                  </div>
                ))}
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarItem asChild>
                <Link to={`/settings/wallets/${wallet.id}/add`}>
                  <UiIcon icon="add" />
                  {t(($) => $.accountAdd)}
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link to={`/settings/wallets/${wallet.id}/edit`}>
                  <UiIcon icon="edit" />
                  {t(($) => $.walletEdit)}
                </Link>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        ))}
        <MenubarSeparator />
        <MenubarItem asChild>
          <Link to="/settings/wallets">
            <UiIcon icon="settings" />
            {t(($) => $.walletSettings)}
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
