import type { ComponentProps, ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.tsx'
import { buttonVariants } from './button.tsx'

export function UiConfirm({
  action,
  actionLabel,
  actionVariant = 'default',
  description,
  title,
  trigger,
  ...props
}: Omit<ComponentProps<typeof AlertDialog>, 'children'> & {
  action: () => Promise<void>
  actionLabel: ReactNode
  actionVariant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary'
  description: ReactNode
  title: ReactNode
  trigger?: ReactNode
}) {
  return (
    <AlertDialog {...props}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: actionVariant })} onClick={action}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
