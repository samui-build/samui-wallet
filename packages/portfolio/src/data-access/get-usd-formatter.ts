const usdFormatters = new Map<string, Intl.NumberFormat>()

export function getUsdFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  // Create a unique key for the formatter based on options
  const key = `max:${options.maximumFractionDigits ?? ''}|min:${options.minimumFractionDigits ?? ''}`
  let formatter = usdFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
      ...options,
    })
    usdFormatters.set(key, formatter)
  }
  return formatter
}
