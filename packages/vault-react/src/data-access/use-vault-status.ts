import { useQuery } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { optionsVault } from './options-vault.ts'

export function useVaultStatus() {
  const context = useAppContext()
  return useQuery(optionsVault.status(context))
}
