import { useWalletDetermineName } from '@workspace/db-react/use-wallet-determine-name'
import { useWalletGenerateWithAccount } from '@workspace/db-react/use-wallet-generate-with-account'
import { useTranslation } from '@workspace/i18n'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { SettingsUiWalletFormGenerate } from './ui/settings-ui-wallet-form-generate.tsx'
import { SettingsUiWalletMnemonicStrength } from './ui/settings-ui-wallet-mnemonic-strength.tsx'

export function SettingsFeatureWalletGenerate() {
  const { t } = useTranslation('settings')
  const generateWalletWithAccountMutation = useWalletGenerateWithAccount()
  const navigate = useNavigate()
  const [strength, setStrength] = useState<128 | 256>(128)
  const name = useWalletDetermineName()
  const mnemonic = useMemo(() => generateMnemonic({ strength }), [strength])

  return (
    <UiCard
      backButtonTo="/settings/wallets/create"
      contentProps={{ className: 'space-y-2 md:space-y-6' }}
      title={t(($) => $.walletPageGenerateTitle)}
    >
      <SettingsUiWalletMnemonicStrength setStrength={setStrength} strength={strength} />
      <SettingsUiWalletFormGenerate
        mnemonic={mnemonic}
        name={name}
        submit={async (input) => {
          await generateWalletWithAccountMutation.mutateAsync(input).then(async (walletId) => {
            await navigate(`/settings/wallets/${walletId}`)
          })
        }}
      />
    </UiCard>
  )
}
