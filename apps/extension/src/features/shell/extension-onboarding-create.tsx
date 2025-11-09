import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDbService } from '@workspace/background/services/db'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { Button } from '@workspace/ui/components/button'

export function ExtensionOnboardingCreate() {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const result = await getDbService().wallet.createWithAccount({
        derivationPath: derivationPaths.default,
        mnemonic: generateMnemonic(),
        name: 'My Wallet',
        secret: '',
      })
      await queryClient.invalidateQueries({ queryKey: ['account', 'active'] })
      return result
    },
  })

  return (
    <div>
      <div>Please set up your wallet</div>
      <Button onClick={async () => await mutateAsync()}>Create Wallet</Button>
    </div>
  )
}
