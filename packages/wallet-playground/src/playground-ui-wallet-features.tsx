import { LucideCheckCircle, LucideXCircle } from 'lucide-react'

export function PlaygroundUiWalletFeatures({
  all,
  selected,
  title,
}: {
  all: `${string}:${string}`[]
  selected: `${string}:${string}`[]
  title: string
}) {
  return (
    <pre className="space-y-2">
      <div className="text-base">{title}</div>
      <ul className="space-y-2 text-xs">
        {all.map((item) => {
          const enabled = selected.includes(item)
          return (
            <li key={item} className="flex items-center gap-2">
              <span>
                {enabled ? (
                  <LucideCheckCircle className="size-4 text-green-500" />
                ) : (
                  <LucideXCircle className="size-4 text-red-500" />
                )}
              </span>
              <span>{item.replace('solana:', '')}</span>
            </li>
          )
        })}
      </ul>
    </pre>
  )
}
