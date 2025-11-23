import { useTranslation } from '@workspace/i18n'
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
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { cn } from '@workspace/ui/lib/utils'
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
  const { t } = useTranslation('portfolio')
  const [open, setOpen] = useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="w-full h-[60px] justify-between" role="combobox" variant="outline">
          {mint ? <PortfolioUiTokenBalanceItem item={mint} /> : t(($) => $.searchInputSelect)}
          <UiIcon className="opacity-50" icon="chevronsUpDown" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput className="h-9" placeholder={t(($) => $.searchInputPlaceholder)} />
          <CommandList>
            <CommandEmpty>{t(($) => $.searchInputNone)}</CommandEmpty>
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
