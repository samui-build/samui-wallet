export function maybeBigInt(value: unknown): bigint | undefined {
  if (typeof value === 'bigint') {
    return value
  }
  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      return undefined
    }

    try {
      return BigInt(value)
    } catch {
      return undefined
    }
  }
  if (typeof value === 'string') {
    if (!/^\s*[+-]?\d+\s*$/.test(value)) {
      return undefined
    }

    try {
      return BigInt(value)
    } catch {
      return undefined
    }
  }
  return undefined
}

export function maybeNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }
  if (typeof value === 'bigint') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  if (typeof value === 'string') {
    if (!value.trim()) {
      return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}
