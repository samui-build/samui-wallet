import type { SettingsGroup } from '../data-access/settings-group.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card.js'
import { SettingsUiItems } from './settings-ui-items.js'

export function SettingsUiGroupCard({ group }: { group: SettingsGroup }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SettingsUiItems group={group} />
      </CardContent>
    </Card>
  )
}
