import type { UiColorName } from '../lib/get-initials-colors.ts'
import { getColorByName, uiColorNames } from '../lib/get-initials-colors.ts'
import { cn } from '../lib/utils.ts'

export function UiFormInputColor({
  className,
  onChange,
  value,
}: {
  className?: string
  onChange: (value: UiColorName) => void
  value?: UiColorName | undefined
}) {
  return (
    <div className={cn('grid grid-cols-6 gap-4', className)}>
      {uiColorNames.map((color) => {
        const { bg, border, text } = getColorByName(color)
        return (
          <button
            aria-pressed={value === color}
            className={cn('flex aspect-square cursor-pointer items-center justify-center border-2', text, border, bg, {
              'border-4 font-bold': value === color,
            })}
            disabled={value === color}
            key={color}
            onClick={() => onChange(color)}
            type="button"
          >
            {color}
          </button>
        )
      })}
    </div>
  )
}
