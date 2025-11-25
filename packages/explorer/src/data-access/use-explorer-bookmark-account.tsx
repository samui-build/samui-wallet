import type { Address } from '@solana/kit'
import { useBookmarkAccountCreate } from '@workspace/db-react/use-bookmark-account-create'
import { useBookmarkAccountDelete } from '@workspace/db-react/use-bookmark-account-delete'
import { useBookmarkAccountFindByAddress } from '@workspace/db-react/use-bookmark-account-find-by-address'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useExplorerBookmarkAccount({ address }: { address: Address }) {
  const query = useBookmarkAccountFindByAddress({ address })
  const mutationCreate = useBookmarkAccountCreate({ address })
  const mutationDelete = useBookmarkAccountDelete({ address })

  return {
    ...query,
    hasBookmark: !!query.data,
    toggle: async () => {
      if (query.data?.id) {
        try {
          await mutationDelete.mutateAsync({ id: query.data.id })
          toastSuccess('Bookmark removed')
        } catch (e) {
          console.log(e)
          toastError('Error removing bookmark')
        }
        return
      }
      try {
        await mutationCreate.mutateAsync({ input: {} })
        toastSuccess('Bookmark added')
      } catch (e) {
        console.log(e)
        toastError('Error adding bookmark')
      }
    },
  }
}
