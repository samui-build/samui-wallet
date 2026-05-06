import type { Address } from '@solana/kit'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function useAddressHover(address: Address) {
  const queryClient = useQueryClient()
  const queryKey = ['address-hover', address]

  const { data: isHovered } = useQuery({
    initialData: false,
    queryFn: () => false,
    queryKey,
    staleTime: Infinity,
  })

  const onMouseEnter = () => queryClient.setQueryData(queryKey, () => true)
  const onMouseLeave = () => queryClient.setQueryData(queryKey, () => false)

  return { isHovered, onMouseEnter, onMouseLeave }
}
