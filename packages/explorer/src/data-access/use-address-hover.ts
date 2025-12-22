import type { Address } from '@solana/kit'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function useAddressHover(address: Address) {
  const queryClient = useQueryClient()
  const queryKey = ['address-hover', address]

  const { data: hoverCount } = useQuery({
    initialData: 0,
    queryFn: () => 0,
    queryKey,
    staleTime: Infinity,
  })

  const onMouseEnter = () => queryClient.setQueryData(queryKey, (old: number = 0) => old + 1)
  const onMouseLeave = () => queryClient.setQueryData(queryKey, (old: number = 0) => Math.max(0, old - 1))

  return { isHovered: (hoverCount ?? 0) > 0, onMouseEnter, onMouseLeave }
}
