import { useState } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { cn } from '../lib/utils.ts'
import { Button } from './button.tsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.tsx'
import { UiEmpty } from './ui-empty.tsx'
import { UiIcon } from './ui-icon.tsx'

export function UiErrorBoundary() {
  const error = useRouteError()
  const isError = error instanceof Error
  const stack = isError ? error.stack : null
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : isError
      ? error.message
      : JSON.stringify(error)

  const description = message ?? 'Unknown error'
  const title = `${isError ? 'A route' : 'An unknown'} error occurred`

  return (
    <div className={cn('flex h-full w-full items-center justify-center px-6')}>
      <UiEmpty className="" description={description} icon="bug" title={title}>
        <UiErrorBoundarySupport />
        {stack ? <UiErrorBoundaryStack stack={stack} /> : null}
      </UiEmpty>
    </div>
  )
}

function UiErrorBoundaryStack({ stack }: { stack: string }) {
  const [showStack, setShowStack] = useState(false)

  return (
    <Collapsible className="max-w-2xl" onOpenChange={setShowStack} open={showStack}>
      <CollapsibleTrigger asChild>
        <Button variant="secondary">
          <span>{showStack ? 'Hide' : 'Show'} stack trace</span>
          <UiIcon icon="chevronsUpDown" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-6">
        <pre className="w-full overflow-auto text-left text-[9px]">{stack}</pre>
      </CollapsibleContent>
    </Collapsible>
  )
}

function UiErrorBoundarySupport() {
  return (
    <div className="whitespace-nowrap">
      Please{' '}
      <a
        className="hover:underline"
        href="https://github.com/samui-build/samui-wallet/issues/new/choose"
        rel="noopener noreferrer"
        target="_blank"
      >
        create an issue
      </a>{' '}
      or{' '}
      <a className="hover:underline" href="http://samui.build/go/discord" rel="noopener noreferrer" target="_blank">
        join our Discord
      </a>{' '}
      if the issue persists.
    </div>
  )
}
