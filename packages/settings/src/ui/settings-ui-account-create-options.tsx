import { LucideHardDrive, LucideNotepadText } from 'lucide-react'

import { SettingsUiAccountCreateComingSoon } from './settings-ui-account-create-coming-soon.js'
import { SettingsUiAccountCreateHeader } from './settings-ui-account-create-header.js'
import { SettingsUiAccountCreateLink } from './settings-ui-account-create-link.js'

export function SettingsUiAccountCreateOptions() {
  return (
    <div className="grid gap-4">
      <SettingsUiAccountCreateHeader icon={LucideNotepadText} label="Seed phrases" />
      <SettingsUiAccountCreateLink
        description="Generate a new seed phrase and derive a wallet"
        title="Generate a new account"
        to="/settings/accounts/generate"
      />
      <SettingsUiAccountCreateLink
        description="Import an existing seed phrase and discover wallets"
        title="Import an existing account"
        to="/settings/accounts/import"
      />
      <SettingsUiAccountCreateHeader icon={LucideHardDrive} label="Hardware wallets" />
      <SettingsUiAccountCreateComingSoon
        description="Unruggable is the first Solana native hardware wallet."
        title="Connect Unruggable"
      />
    </div>
  )
}
