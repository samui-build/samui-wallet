import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useDetermineAccountName } from './data-access/use-determine-account-name.js'
import { useGenerateAccountWithWalletMutation } from './data-access/use-generate-account-with-wallet-mutation.js'
import { SettingsUiAccountFormGenerate } from './ui/settings-ui-account-form-generate.js'
import { SettingsUiAccountMnemonicStrength } from './ui/settings-ui-account-mnemonic-strength.js'

export function SettingsFeatureAccountGenerate() {
  const generateAccountWithWalletMutation = useGenerateAccountWithWalletMutation()
  const navigate = useNavigate()
  const [strength, setStrength] = useState<128 | 256>(128)
  const name = useDetermineAccountName()
  const mnemonic = useMemo(() => generateMnemonic({ strength }), [strength])

  return (
    <UiCard
      contentProps={{ className: 'grid gap-6' }}
      title={
        <div className="flex items-center gap-2">
          <UiBack />
          Generate Account
        </div>
      }
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
