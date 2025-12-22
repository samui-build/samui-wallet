import type { Address } from '@solana/kit'
import { TOKEN_2022_PROGRAM_ADDRESS, TOKEN_PROGRAM_ADDRESS } from '@workspace/solana-client/constants'
import { Badge } from '@workspace/ui/components/badge'

export function ExplorerUiProgramLabel({ address }: { address: Address }) {
  switch (address) {
    case TOKEN_PROGRAM_ADDRESS:
      return <Badge variant="outline">Token</Badge>
    case TOKEN_2022_PROGRAM_ADDRESS:
      return <Badge variant="outline">Token 2022</Badge>
    default:
      return null
  }
}
