import type { ReactNode } from 'react'

export interface ExtensionFooterProps {
  text?: ReactNode
}

export function ExtensionFooter({ text = 'Samui' }: ExtensionFooterProps) {
  return (
    <footer className="px-4 py-2 bg-muted/50 text-center text-muted-foreground flex items-center justify-center gap-2">
      <span className="text-lg">{text}</span>
    </footer>
  )
}
