import type { ReactNode } from 'react'
import { UiEmpty } from './ui-empty.tsx'

export function UiError({ message, title = 'Oops, an error occurred' }: { message?: Error; title?: ReactNode }) {
  return <UiEmpty description={message ? message?.message : undefined} title={title} />
}
