import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@workspace/ui/components/empty'

export function ExtensionNoWallet() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>You have no wallet</EmptyTitle>
        <EmptyDescription>Please set up your wallet first.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
