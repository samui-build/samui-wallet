import type { AccountInputCreate } from '@workspace/db/dto/account-input-create'

import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { useMemo, useState } from 'react'

export function useAccountInputCreate() {
  const items = useDbAccountLive()
  const [strength, setStrength] = useState<128 | 256>(128)
  const input: AccountInputCreate = useMemo(
    () => ({
      derivationPath: derivationPaths.default,
      mnemonic: generateMnemonic({ strength }),
      name: `Account ${items.length + 1}`,
      secret: 'password',
    }),
    [strength],
  )

  return {
    input,
    setStrength,
    strength,
  }
}
