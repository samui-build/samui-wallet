import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { SettingsItem } from '../data-access/settings-item.js'
import { SettingsUiInput } from './settings-ui-input.js'

export function SettingsUiCard({ item }: { item: SettingsItem }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          {item.description?.length ? item.description : 'Please provide Setting description'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SettingsUiInput item={item} />
      </CardContent>
    </Card>
  )
}
