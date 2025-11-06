const tokenFormatters = new Map<string, Intl.NumberFormat>()

export function getTokenFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${options.maximumFractionDigits ?? ''}-${options.minimumFractionDigits ?? ''}`
  let formatter = tokenFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', options)
    tokenFormatters.set(key, formatter)
  }
  return formatter
}
