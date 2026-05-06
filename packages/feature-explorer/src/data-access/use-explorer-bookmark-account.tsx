import type { Address } from '@solana/kit'
import { useBookmarkAccountFindByAddress } from '@workspace/db-react/use-bookmark-account-find-by-address'
import { useBookmarkAccountToggle } from '@workspace/db-react/use-bookmark-account-toggle'
import { useTranslation } from '@workspace/i18n'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export function useExplorerBookmarkAccount({ address }: { address: Address }) {
  const { t } = useTranslation('explorer')
  const bookmark = useBookmarkAccountFindByAddress({ address })
  const mutationToggle = useBookmarkAccountToggle()

  return {
    hasBookmark: Boolean(bookmark),
    toggle: async () => {
      try {
        const result = await mutationToggle.mutateAsync({ address })
        toastSuccess(result === 'created' ? t(($) => $.bookmarkAdded) : t(($) => $.bookmarkRemoved))
      } catch (e) {
        console.log(e)
        toastError('Error toggling bookmark')
      }
    },
  }
}
