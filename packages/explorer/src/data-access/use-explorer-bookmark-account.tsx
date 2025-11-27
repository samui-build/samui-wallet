import type { Address } from '@solana/kit'
import { useBookmarkAccountFindByAddress } from '@workspace/db-react/use-bookmark-account-find-by-address'
import { useBookmarkAccountToggle } from '@workspace/db-react/use-bookmark-account-toggle'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useExplorerBookmarkAccount({ address }: { address: Address }) {
  const query = useBookmarkAccountFindByAddress({ address })
  const mutationToggle = useBookmarkAccountToggle()

  return {
    ...query,
    hasBookmark: !!query.data,
    toggle: async () => {
      try {
        const result = await mutationToggle.mutateAsync({ address })
        toastSuccess(`Bookmark ${result === 'created' ? 'added' : 'removed'}`)
      } catch (e) {
        console.log(e)
        toastError('Error toggling bookmark')
      }
    },
  }
}
