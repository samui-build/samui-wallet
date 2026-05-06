import { useLocation } from 'react-router'

export function useExplorerBackButtonTo({ basePath }: { basePath: string }) {
  const location = useLocation()

  const from = location.state?.from ?? basePath
  return from.startsWith('/') ? from : `${basePath}/${from}`
}
