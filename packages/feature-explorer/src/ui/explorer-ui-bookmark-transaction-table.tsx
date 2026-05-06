import type { BookmarkTransaction } from '@workspace/db/bookmark-transaction/bookmark-transaction'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { UiConfirm } from '@workspace/ui/components/ui-confirm'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiPrompt } from '@workspace/ui/components/ui-prompt'
import { ExplorerUiBookmarkTransactionEmpty } from './explorer-ui-bookmark-transaction-empty.tsx'
import { ExplorerUiLinkSignature } from './explorer-ui-link-signature.tsx'

export function ExplorerUiBookmarkTransactionTable({
  basePath,
  toggleItem,
  updateItem,
  items,
}: {
  basePath: string
  toggleItem: (item: BookmarkTransaction) => Promise<void>
  items: BookmarkTransaction[]
  updateItem: (item: BookmarkTransaction) => Promise<void>
}) {
  const { t } = useTranslation('explorer')
  return items.length ? (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{t(($) => $.signature)}</TableHead>
          <TableHead>{t(($) => $.label)}</TableHead>
          <TableHead className="w-[120px] text-right">{t(($) => $.actions)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="md:w-[400px]">
              <ExplorerUiLinkSignature basePath={basePath} className="text-xs" signature={item.signature} />
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
    <ExplorerUiBookmarkTransactionEmpty />
  )
}
