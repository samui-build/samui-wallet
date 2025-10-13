import type { DerivedWallet } from '@workspace/keypair/derive-from-mnemonic-at-index'

import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { UiBack } from '@workspace/ui/components/ui-back'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAccountInputCreate } from './use-account-input-create.js'
import { useDeriveFromMnemonic } from './use-derive-from-mnemonic.js'
import { useGenerateAccountWithWalletMutation } from './use-generate-account-with-wallet-mutation.js'

export function SettingsFeatureAccountGenerate() {
  const generateAccountWithWalletMutation = useGenerateAccountWithWalletMutation()
  const navigate = useNavigate()
  const { input, setStrength, strength } = useAccountInputCreate()
  const [derivedWallet, setDerivedWallet] = useState<DerivedWallet>()
  const deriveFromMnemonicMutation = useDeriveFromMnemonic()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Generate Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ButtonGroup>
          <Button disabled={strength === 128} onClick={() => setStrength(128)}>
            12 words
          </Button>
          <Button disabled={strength === 256} onClick={() => setStrength(256)}>
            24 words
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            onClick={async () => {
              if (!input) {
                return
              }
              const result = await deriveFromMnemonicMutation.mutateAsync({ mnemonic: input.mnemonic })
              setDerivedWallet(result)
            }}
          >
            Derive
          </Button>
          <Button
            onClick={async () => {
              if (!input) {
                return
              }
              await deriveFromMnemonicMutation.mutateAsync({ mnemonic: input.mnemonic })
              generateAccountWithWalletMutation.mutateAsync(input).then(() => {
                navigate('/settings/accounts')
              })
            }}
          >
            Generate
          </Button>
        </ButtonGroup>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(
            {
              derivedWallet,
              input,
            },
            null,
            2,
          )}
        </pre>
      </CardContent>
    </Card>
  )
}
