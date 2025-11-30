import { useTranslation } from '@workspace/i18n'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDetermineWalletName } from './data-access/use-determine-wallet-name.tsx'
import { useGenerateWalletWithAccountMutation } from './data-access/use-generate-wallet-with-account-mutation.tsx'
import { SettingsUiWalletFormGenerate } from './ui/settings-ui-wallet-form-generate.tsx'
import { SettingsUiWalletMnemonicStrength } from './ui/settings-ui-wallet-mnemonic-strength.tsx'

export function SettingsFeatureWalletGenerate() {
  const { t } = useTranslation('settings')
  const generateWalletWithAccountMutation = useGenerateWalletWithAccountMutation()
  const navigate = useNavigate()
  const [strength, setStrength] = useState<128 | 256>(128)
  const name = useDetermineWalletName()
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
          generateWalletWithAccountMutation.mutateAsync(input).then((walletId) => {
            navigate(`/settings/wallets/${walletId}`)
          })
        }}
      />
    </UiCard>
  )
}
