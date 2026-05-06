import type { Signature } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { useGetTransactionBase64 } from '@workspace/solana-client-react/use-get-transaction-base64'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useHandleCopyText } from '@workspace/ui/components/use-handle-copy-text'
import { cn } from '@workspace/ui/lib/utils'

export function ExplorerFeatureTransactionCopyButton({
  network,
  signature,
}: {
  network: Network
  signature: Signature
}) {
  const { t } = useTranslation('explorer')
  const { copied, handleCopy } = useHandleCopyText()
  const query = useGetTransactionBase64({ network, signature })
  const transactionBase64 = query.data ?? ''

  return (
    <Button
      aria-label={t(($) => $.transactionCopyBase64)}
      disabled={!transactionBase64}
      onClick={() =>
        handleCopy({
          text: transactionBase64,
          toast: t(($) => $.transactionCopyBase64Success),
          toastFailed: t(($) => $.transactionCopyBase64Failed),
        })
      }
      size="icon"
      title={t(($) => $.transactionCopyBase64)}
      type="button"
      variant="outline"
    >
      <UiIcon className={cn({ 'text-green-500': copied })} icon={copied ? 'copyCheck' : 'copy'} />
    </Button>
  )
}
