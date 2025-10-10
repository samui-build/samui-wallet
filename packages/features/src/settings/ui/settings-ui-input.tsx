import type { ReactNode } from 'react'

import { Input } from '@workspace/ui/components/input.js'
import { Label } from '@workspace/ui/components/label.js'
import { Switch } from '@workspace/ui/components/switch.js'

import type { SettingsItem } from '../data-access/settings-item.js'

import { SettingsType } from '../data-access/settings-type.js'

export function SettingsUiInput({ item }: { item: SettingsItem }) {
  switch (item.type) {
    case SettingsType.Boolean:
      return (
        <SettingsUiInputWrapper>
          <Label className="flex flex-col items-start" htmlFor={item.id}>
            <span>{item.name}</span>
            <span className="text-muted-foreground leading-snug font-normal">{item.description}</span>
          </Label>
          <Switch aria-label={item.name} defaultChecked id={item.id} />
        </SettingsUiInputWrapper>
      )
    case SettingsType.Number:
      return (
        <SettingsUiInputWrapper>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor={item.id}>{item.name}</Label>
            <Input id={item.id} placeholder={item.name} type="number" />
          </div>
          <input type="number" />
        </SettingsUiInputWrapper>
      )
    case SettingsType.String:
      return (
        <SettingsUiInputWrapper>
          <Label className="flex flex-col items-start" htmlFor={item.id}>
            <span>{item.name}</span>
            <span className="text-muted-foreground leading-snug font-normal">{item.description}</span>
          </Label>
          <Input id={item.id} placeholder={item.name} type="text" />
        </SettingsUiInputWrapper>
      )
  }
}

export function SettingsUiInputWrapper({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-4">{children}</div>
}
