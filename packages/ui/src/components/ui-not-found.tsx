import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './empty.tsx'

export function UiNotFound() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>The page you&apos;re looking for doesn&apos;t exist.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
