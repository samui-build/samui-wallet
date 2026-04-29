import type { FocusEventHandler, Key, ReactNode, Ref } from 'react'
import { useState } from 'react'
import { cn } from '../lib/utils.ts'
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from './combobox.tsx'

export type UiGroupedComboboxInputGroup<TItem> = {
  items: TItem[]
  label: string
}

export function UiGroupedComboboxInput<TItem>({
  autoFocus,
  contentClassName,
  disabledMessage,
  emptyMessage,
  filter,
  getItemKey,
  getItemLabel,
  getItemValue,
  groups,
  id,
  inputRef,
  name,
  onBlur,
  onValueChange,
  placeholder,
  shouldOpenSuggestions = () => true,
  sideOffset,
  value,
}: {
  autoFocus?: boolean
  contentClassName?: string
  disabledMessage: string
  emptyMessage: string
  filter: (item: TItem, query: string) => boolean
  getItemKey: (item: TItem) => Key
  getItemLabel: (item: TItem) => ReactNode
  getItemValue: (item: TItem) => string
  groups: UiGroupedComboboxInputGroup<TItem>[]
  id?: string
  inputRef?: Ref<HTMLInputElement>
  name?: string
  onBlur?: FocusEventHandler<HTMLInputElement>
  onValueChange: (value: string) => void
  placeholder?: string
  shouldOpenSuggestions?: (value: string) => boolean
  sideOffset?: number
  value: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasGroups = groups.length > 0
  const hasItems = groups.some((group) => group.items.length)
  const isSuggestionsOpen = isOpen && shouldOpenSuggestions(value)

  return (
    <Combobox
      autoComplete="list"
      filter={filter}
      inputValue={value}
      items={groups}
      itemToStringLabel={getItemValue}
      itemToStringValue={getItemValue}
      onInputValueChange={(nextValue, eventDetails) => {
        if (eventDetails.reason === 'none') {
          return
        }
        setIsOpen(shouldOpenSuggestions(nextValue))
        onValueChange(nextValue)
      }}
      onOpenChange={setIsOpen}
      onValueChange={(item) => {
        if (!item) {
          return
        }
        setIsOpen(false)
        onValueChange(getItemValue(item))
      }}
      open={isSuggestionsOpen}
    >
      <ComboboxInput
        autoComplete="off"
        autoFocus={autoFocus}
        id={id}
        name={name}
        onBlur={onBlur}
        placeholder={placeholder}
        ref={inputRef}
        showClear={!!value}
      />
      <ComboboxContent className={cn('max-h-[60vh] min-w-0', contentClassName)} sideOffset={sideOffset}>
        {hasItems || !hasGroups ? <ComboboxEmpty>{emptyMessage}</ComboboxEmpty> : null}
        <ComboboxList className="overflow-x-hidden">
          <ComboboxCollection>
            {(group: UiGroupedComboboxInputGroup<TItem>) => (
              <ComboboxGroup items={group.items} key={group.label}>
                <ComboboxLabel>{group.label}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: TItem, index: number) => (
                    <ComboboxItem
                      className="block h-auto w-full cursor-pointer overflow-hidden p-2 pr-8 data-highlighted:text-foreground"
                      index={index}
                      key={getItemKey(item)}
                      value={item}
                    >
                      <span className="block truncate font-medium">{getItemLabel(item)}</span>
                      <span className="block truncate font-mono text-muted-foreground text-xs">
                        {getItemValue(item)}
                      </span>
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                {!group.items.length ? (
                  <ComboboxItem className="text-muted-foreground *:data-[slot=combobox-item-indicator]:hidden" disabled>
                    {disabledMessage}
                  </ComboboxItem>
                ) : null}
              </ComboboxGroup>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
