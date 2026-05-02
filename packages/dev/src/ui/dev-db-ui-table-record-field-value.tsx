import { isAddress, isSignature } from '@solana/kit'
import type { DbRecord } from '@workspace/db/db-table-metadata'
import { ExplorerUiLinkAddress } from '@workspace/explorer/ui/explorer-ui-link-address'
import { ExplorerUiLinkSignature } from '@workspace/explorer/ui/explorer-ui-link-signature'
import { useTranslation } from '@workspace/i18n'
import { formatDevDbValue } from './dev-db-ui-format.ts'

export function DevDbUiTableRecordFieldValue({ field, item }: { field: string; item: DbRecord }) {
  const { t } = useTranslation('explorer')
  const formatted = formatDevDbValue(item[field])
  if (formatted === '-') {
    return <span className="text-muted-foreground italic">{t(($) => $.labelEmpty)}</span>
  }
  if (isAddress(formatted) && (field === 'address' || field === 'publicKey')) {
    return <ExplorerUiLinkAddress address={formatted} basePath="/explorer" />
  }
  if (isSignature(formatted) && field === 'signature') {
    return <ExplorerUiLinkSignature basePath="/explorer" signature={formatted} />
  }
  return formatted
}
