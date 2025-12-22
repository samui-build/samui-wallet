import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'

export function UiToastLink({ className, label, href }: { className?: string; label?: string; href: string }) {
  return (
    <a
      className={cn('inline-flex items-center gap-1 font-mono hover:underline', className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{label}</span>
      <UiIcon className="size-3 shrink-0" icon="externalLink" />
    </a>
  )
}
