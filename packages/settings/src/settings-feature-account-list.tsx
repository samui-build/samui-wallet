import { useDbAccountDelete } from '@workspace/db-react/use-db-account-delete'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { Link } from 'react-router'

import { useActiveAccount } from './data-access/use-active-account.js'
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
  const { accounts, active, setActive } = useActiveAccount()

  return accounts.length ? (
    <SettingsUiPageCard
      action={
        <Button asChild variant="outline">
          <Link to="create">Create</Link>
        </Button>
      }
      page={page}
    >
      <SettingsUiAccountList
        active={active}
        deleteItem={(input) => deleteMutation.mutateAsync({ id: input.id })}
        items={accounts}
        setActive={setActive}
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
