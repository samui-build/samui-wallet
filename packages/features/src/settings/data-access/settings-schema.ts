import { Schema } from 'effect'

export const SettingsSchema = Schema.Struct({
  autoLockEnabled: Schema.BooleanFromString,
  autoLockSeconds: Schema.NumberFromString,
  // TODO: Make this an enum of USD/EUR/etc
  currency: Schema.String,
  // TODO: Make this an enum of EN/ES
  language: Schema.String,
  age: Schema.NumberFromString,
})

export type Settings = Schema.Schema.Type<typeof SettingsSchema>

export type SettingsEncoded = Schema.Schema.Encoded<typeof SettingsSchema>
