import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useDetermineAccountName } from './data-access/use-determine-account-name.tsx'
import { useGenerateAccountWithWalletMutation } from './data-access/use-generate-account-with-wallet-mutation.tsx'
import { SettingsUiAccountFormGenerate } from './ui/settings-ui-account-form-generate.tsx'
import { SettingsUiAccountMnemonicStrength } from './ui/settings-ui-account-mnemonic-strength.tsx'

export function SettingsFeatureAccountGenerate() {
  const generateAccountWithWalletMutation = useGenerateAccountWithWalletMutation()
  const navigate = useNavigate()
  const [strength, setStrength] = useState<128 | 256>(128)
  const name = useDetermineAccountName()
  const mnemonic = useMemo(() => generateMnemonic({ strength }), [strength])

  return (
    <UiCard
      backButtonTo="/settings/accounts/create"
      contentProps={{ className: 'grid gap-6' }}
      title="Generate Account"
    >
      <SettingsUiAccountMnemonicStrength setStrength={setStrength} strength={strength} />
      <SettingsUiAccountFormGenerate
        mnemonic={mnemonic}
        name={name}
        submit={async (input) => {
          generateAccountWithWalletMutation.mutateAsync(input).then((accountId) => {
            navigate(`/settings/accounts/${accountId}`)
          })
        }}
      />
    </UiCard>
  )
}
