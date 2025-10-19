import { useDbAccountDelete } from '@workspace/db-react/use-db-account-delete'
import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbPreferenceFindUnique } from '@workspace/db-react/use-db-preference-find-unique-by-key'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link } from 'react-router'

import { useSettingsPage } from './data-access/use-settings-page.js'
import { SettingsUiAccountCreateOptions } from './ui/settings-ui-account-create-options.js'
import { SettingsUiAccountList } from './ui/settings-ui-account-list.js'
import { SettingsUiPageCard } from './ui/settings-ui-page-card.js'

export function SettingsFeatureAccountList() {
  const page = useSettingsPage({ pageId: 'accounts' })
  const deleteMutation = useDbAccountDelete({
    onError: () => toastError('Error deleting account'),
    onSuccess: () => toastSuccess('Account deleted'),
  })
  const items = useDbAccountLive()
  const { data } = useDbPreferenceFindUnique({ key: 'activeAccountId' })
  const { mutateAsync } = useDbPreferenceUpdateByKey('activeAccountId')

  return items.length ? (
    <SettingsUiPageCard
      action={
        <Button asChild variant="outline">
          <Link to="create">Create</Link>
        </Button>
      }
      page={page}
    >
      <SettingsUiAccountList
        activeId={data?.value ?? null}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={items}
        setActive={async (item) => {
          if (!data?.id) {
            return
          }
          await mutateAsync({ input: { value: item.id } })
        }}
      />
    </SettingsUiPageCard>
  ) : (
    <Card>
      <CardContent className="grid gap-6">
        <SettingsUiAccountCreateOptions />
      </CardContent>
    </Card>
  )
}
