import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDbService } from '@workspace/background/services/db'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { Button } from '@workspace/ui/components/button'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

export function App() {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const result = await getDbService().account.createWithWallet({
        derivationPath: derivationPaths.default,
        mnemonic: generateMnemonic(),
        name: 'My Account',
        secret: '',
      })
      await queryClient.invalidateQueries({ queryKey: ['wallet', 'active'] })
      return result
    },
  })

  const { data: active } = useQuery({
    queryFn: async () => await getDbService().wallet.active(),
    queryKey: ['wallet', 'active'],
  })

  return (
    <div className="p-4">
      {active ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Active Account</h1>
          <div className="text-sm text-gray-500">{ellipsify(active.publicKey)}</div>
        </div>
      ) : (
        <Button onClick={async () => await mutateAsync()}>Create Account</Button>
      )}
    </div>
  )
}
