import type { ComponentProps, ReactNode } from 'react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { UiBack } from '@workspace/ui/components/ui-back'
import { cn } from '@workspace/ui/lib/utils'

export function UiCard({
  action,
  actionProps,
  backButtonTo,
  cardProps,
  children,
  contentProps,
  description,
  descriptionProps,
  footer,
  footerProps,
  headerProps,
  title,
  titleProps,
}: {
  action?: ReactNode
  actionProps?: Omit<ComponentProps<typeof CardAction>, 'children'>
  backButtonTo?: string
  cardProps?: Omit<ComponentProps<typeof Card>, 'children'>
  children: ReactNode
  contentProps?: Omit<ComponentProps<typeof CardContent>, 'children'>
  description?: ReactNode
  descriptionProps?: Omit<ComponentProps<typeof CardDescription>, 'children'>
  footer?: ReactNode
  footerProps?: Omit<ComponentProps<typeof CardFooter>, 'children'>
  headerProps?: Omit<ComponentProps<typeof CardHeader>, 'children'>
  title?: ReactNode
  titleProps?: Omit<ComponentProps<typeof CardTitle>, 'children'>
}) {
  return (
    <Card {...cardProps}>
      {action || description || title ? (
        <CardHeader {...headerProps}>
          {title ? (
            <CardTitle className={cn('flex items-center gap-2', titleProps?.className)} {...titleProps}>
              {backButtonTo ? <UiBack to={backButtonTo} /> : null}
              {title}
            </CardTitle>
          ) : null}
          {description ? <CardDescription {...descriptionProps}>{description}</CardDescription> : null}
          {action ? <CardAction {...actionProps}>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent {...contentProps}>{children}</CardContent>
      {footer ? <CardFooter {...footerProps}>{footer}</CardFooter> : null}
    </Card>
  )
}
