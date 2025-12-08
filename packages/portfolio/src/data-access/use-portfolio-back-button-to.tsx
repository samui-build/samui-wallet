import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

export function usePortfolioBackButtonTo({ basePath = '/portfolio' }: { basePath?: string } = {}) {
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from ?? basePath

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        navigate(from)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [from, navigate])

  return from.startsWith('/') ? from : `${basePath}/${from}`
}
