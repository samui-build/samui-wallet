import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './empty.js'

export function UiError({ message = '' }: { message?: unknown }) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>Oops, an error occurred</EmptyTitle>
        <EmptyDescription>{`${message}`}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
