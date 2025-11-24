import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'

export function ExplorerUiBookmarkAccountList({ basePath, items }: { basePath: string; items: BookmarkAccount[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div className="text-sm" key={item.id}>
          <ExplorerUiLinkAddress address={item.address} basePath={basePath} label={item.label} />
        </div>
      ))}
    </div>
  )
}
