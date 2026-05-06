import type { BookmarkTransaction } from '@workspace/db/bookmark-transaction/bookmark-transaction'
import { ExplorerUiLinkSignature } from './explorer-ui-link-signature.tsx'

export function ExplorerUiBookmarkTransactionList({
  basePath,
  items,
}: {
  basePath: string
  items: BookmarkTransaction[]
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div className="text-sm" key={item.id}>
          <ExplorerUiLinkSignature basePath={basePath} label={item.label} signature={item.signature} />
        </div>
      ))}
    </div>
  )
}
