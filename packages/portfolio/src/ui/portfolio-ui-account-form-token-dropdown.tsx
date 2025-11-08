import { Button } from '@workspace/ui/components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { cn } from '@workspace/ui/lib/utils'
import { ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'

import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiAccountFormTokenDropdown({
  mint,
  mintAddress,
  setMintAddress,
  tokens,
}: {
  mint: TokenBalance | undefined
  mintAddress: string
  setMintAddress: (mintAddress: string) => void
  tokens: TokenBalance[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-full h-[60px] justify-between" role="combobox" variant="outline">
          {mint ? <PortfolioUiTokenBalanceItem item={mint} /> : 'Select token...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {tokens.map((item) => (
                <CommandItem
                  className={cn({
                    'bg-muted': mintAddress === item.mint,
                  })}
                  key={item.mint}
                  onSelect={(currentValue) => {
                    setMintAddress(currentValue === mintAddress ? '' : currentValue)
                    setOpen(false)
                  }}
                  value={item.mint}
                >
                  <PortfolioUiTokenBalanceItem item={item} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
