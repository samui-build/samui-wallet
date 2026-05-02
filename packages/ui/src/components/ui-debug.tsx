import { stringify } from '../lib/stringify.ts'
import { UiPre, type UiPreProps } from './ui-pre.tsx'

export function UiDebug({ data, className, ...props }: { data: string | unknown } & UiPreProps) {
  return (
    <UiPre className={className} {...props}>
      {stringify(data)}
    </UiPre>
  )
}
