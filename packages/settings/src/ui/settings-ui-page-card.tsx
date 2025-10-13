import type { ReactNode } from 'react'

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

import type { SettingsPage } from '../data-access/settings-page.js'

export function SettingsUiPageCard({
  action,
  children,
  page,
}: {
  action?: ReactNode
  children: ReactNode
  page: SettingsPage
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div>{page.name}</div>
        </CardTitle>
        <CardDescription>{page.description}</CardDescription>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="grid gap-6">{children}</CardContent>
    </Card>
  )
}
