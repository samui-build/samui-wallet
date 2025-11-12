import { SettingsUiWalletCreateComingSoon } from './settings-ui-wallet-create-coming-soon.tsx'
import { SettingsUiWalletCreateHeader } from './settings-ui-wallet-create-header.tsx'
import { SettingsUiWalletCreateLink } from './settings-ui-wallet-create-link.tsx'

export function SettingsUiWalletCreateOptions() {
  return (
    <div className="grid gap-4">
      <SettingsUiWalletCreateHeader icon="mnemonic" label="Seed phrases" />
      <SettingsUiWalletCreateLink
        description="Generate a new seed phrase and derive an account"
        title="Generate a new wallet"
        to="/settings/wallets/generate"
      />
      <SettingsUiWalletCreateLink
        description="Import an existing seed phrase and discover accounts"
        title="Import an existing wallet"
        to="/settings/wallets/import"
      />
      <SettingsUiWalletCreateHeader icon="hardware" label="Hardware accounts" />
      <SettingsUiWalletCreateComingSoon
        description="Unruggable is the first Solana native hardware account."
        title="Connect Unruggable"
      />
    </div>
  )
}
