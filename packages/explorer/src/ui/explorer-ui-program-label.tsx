import { type Address, address } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { Badge } from '@workspace/ui/components/badge'
import { ExplorerUiAddress } from './explorer-ui-address.tsx'

const tokens = new Map<Address, string>()
  .set(TOKEN_2022_PROGRAM_ADDRESS, 'Token 2022')
  .set(TOKEN_PROGRAM_ADDRESS, 'Token')
  .set(address('11111111111111111111111111111111'), 'System Program')
  .set(address('SysvarRent111111111111111111111111111111111'), 'Sysvar: Rent')

export function ExplorerUiProgramLabel({ address }: { address: Address }) {
  const found = tokens.get(address)

  if (!found) {
    return <ExplorerUiAddress address={address} />
  }
  return <Badge variant="outline">{found}</Badge>
}
