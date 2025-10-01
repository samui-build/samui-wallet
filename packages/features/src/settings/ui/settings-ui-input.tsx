import type { SettingsItem } from '../data-access/settings-item.js'
import { SettingsType } from '../data-access/settings-type.js'
import { Switch } from '@workspace/ui/components/switch.js'
import type { ReactNode } from 'react'
import { Label } from '@workspace/ui/components/label.js'
import { Input } from '@workspace/ui/components/input.js'

export function SettingsUiInputWrapper({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-4">{children}</div>
}

export function SettingsUiInput({ item }: { item: SettingsItem }) {
  switch (item.type) {
    case SettingsType.Boolean:
      return (
        <SettingsUiInputWrapper>
          <Label htmlFor={item.id} className="flex flex-col items-start">
            <span>{item.name}</span>
            <span className="text-muted-foreground leading-snug font-normal">{item.description}</span>
          </Label>
          <Switch id={item.id} defaultChecked aria-label={item.name} />
        </SettingsUiInputWrapper>
      )
    case SettingsType.Number:
      return (
        <SettingsUiInputWrapper>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor={item.id}>{item.name}</Label>
            <Input type="number" id={item.id} placeholder={item.name} />
          </div>
          <input type="number" />
        </SettingsUiInputWrapper>
      )
    case SettingsType.String:
      return (
        <SettingsUiInputWrapper>
          <Label htmlFor={item.id} className="flex flex-col items-start">
            <span>{item.name}</span>
            <span className="text-muted-foreground leading-snug font-normal">{item.description}</span>
          </Label>
          <Input type="text" id={item.id} placeholder={item.name} />
        </SettingsUiInputWrapper>
      )
  }
}
