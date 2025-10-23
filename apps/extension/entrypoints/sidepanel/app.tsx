import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDbService } from '@workspace/background/services/db'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { generateMnemonic } from '@workspace/keypair/generate-mnemonic'
import { Button } from '@workspace/ui/components/button'

export function App() {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await getDbService().account.createWithWallet({
        derivationPath: derivationPaths.default,
        mnemonic: generateMnemonic(),
        name: 'My Account',
        secret: '',
      })
      queryClient.invalidateQueries({ queryKey: ['preferences', 'activeWalletId'] })
      queryClient.invalidateQueries({ queryKey: ['preferences', 'activeAccountId'] })
    },
  })
  const { data: activeWalletId } = useQuery({
    queryFn: async () => await getDbService().preferences.get('activeWalletId'),
    queryKey: ['preferences', 'activeWalletId'],
  })
  const { data: activeAccountId } = useQuery({
    queryFn: async () => await getDbService().preferences.get('activeAccountId'),
    queryKey: ['preferences', 'activeAccountId'],
  })

  return (
    <div className="p-4">
      {activeWalletId && activeAccountId ? (
        <>
          <div>Active Wallet ID: {activeWalletId}</div>
          <div>Active Account ID: {activeAccountId}</div>
        </>
      ) : (
        <Button onClick={async () => await mutateAsync()}>Create Account</Button>
      )}
    </div>
  )
}
