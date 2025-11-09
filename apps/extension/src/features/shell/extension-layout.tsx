import { cn } from '@workspace/ui/lib/utils'
import type { ReactNode } from 'react'
import type { ExtensionShellMode } from '@/features/shell/extension-shell.tsx'

export function ExtensionLayout({ children, mode }: { children: ReactNode; mode: ExtensionShellMode }) {
  return (
    <div
      className={cn('h-full', {
        'w-[300px] h-[500px]': mode === 'Popup',
      })}
    >
      {children}
    </div>
  )
}
