import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiPrompt } from '@workspace/ui/components/ui-prompt'
import { ExplorerUiBookmarkAccountEmpty } from './explorer-ui-bookmark-account-empty.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'

export function ExplorerUiBookmarkAccountTable({
  basePath,
  toggleItem,
  updateItem,
  items,
}: {
  basePath: string
  toggleItem: (item: BookmarkAccount) => Promise<void>
  items: BookmarkAccount[]
  updateItem: (item: BookmarkAccount) => Promise<void>
}) {
  const { t } = useTranslation('explorer')
  return items.length ? (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{t(($) => $.address)}</TableHead>
          <TableHead>{t(($) => $.label)}</TableHead>
          <TableHead className="w-[120px] text-right">{t(($) => $.actions)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="md:w-[400px]">
              <ExplorerUiLinkAddress address={item.address} basePath={basePath} className="text-xs" />
            </TableCell>
            <TableCell>
              {item.label?.length ? (
                <span>{item.label}</span>
              ) : (
                <span className="text-muted-foreground italic">{t(($) => $.labelEmpty)}</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="space-x-2">
                <UiPrompt
                  action={(label) => updateItem({ ...item, label: label ?? '' })}
                  actionLabel={t(($) => $.actionUpdate)}
                  inputProps={{ maxLength: 50 }}
                  label={t(($) => $.label)}
                  placeholder={t(($) => $.labelInputPlaceholder)}
                  title={t(($) => $.editLabel)}
                  value={item.label ?? ''}
                >
                  <Button size="icon" title={t(($) => $.editLabel)} variant="outline">
                    <UiIcon icon="edit" />
                  </Button>
                </UiPrompt>
                <UiConfirm
                  action={async () => {
                    await toggleItem(item)
                  }}
                  actionLabel={t(($) => $.actionDelete)}
                  description={t(($) => $.bookmarkDeleteDescription)}
                  title={t(($) => $.bookmarkDeleteTitle)}
                  trigger={
                    <Button size="icon" title={t(($) => $.bookmarkDelete)} variant="outline">
                      <UiIcon className="text-red-500" icon="delete" />
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <ExplorerUiBookmarkAccountEmpty />
  )
}
