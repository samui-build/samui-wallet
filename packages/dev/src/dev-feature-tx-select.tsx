import type { Address, Signature } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { unixTimestampToDate } from '@workspace/solana-client/unix-timestamp-to-date'
import { useGetSignaturesForAddress } from '@workspace/solana-client-react/use-get-signatures-for-address'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiTime } from '@workspace/ui/components/ui-time'
import { ellipsify } from '@workspace/ui/lib/ellipsify'

export function DevFeatureTxSelect({
  address,
  network,
  select,
}: {
  address: Address
  network: Network
  select: (signature: Signature) => void
}) {
  const txQuery = useGetSignaturesForAddress({ address, network })
  const options = (txQuery.data ?? [])?.map((item) => ({
    label: ellipsify(item.signature, 8, '…'),
    time: item.blockTime ? unixTimestampToDate(item.blockTime) : null,
    value: item.signature,
  }))
  return (
    <Select onValueChange={select}>
      <SelectTrigger disabled={txQuery.isLoading}>
        {txQuery.isLoading ? <UiLoader className="size-4" /> : <SelectValue placeholder="Select transaction" />}
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem className="font-mono" key={item.value} value={item.value}>
            {item.label} {item.time ? <UiTime time={item.time} /> : null}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
