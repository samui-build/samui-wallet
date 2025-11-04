/*
 * From https://github.com/mantinedev/mantine
 * MIT License
 * Copyright (c) 2021 Vitaly Rtishchev
 */
import { describe, expect, it } from 'vitest'

import { getInitials } from './get-initials.ts'

describe('get-initials', () => {
  it('should return initials', () => {
    expect(getInitials('John Mol')).toBe('JM')
    expect(getInitials('John')).toBe('JO')
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('John Doe', 1)).toBe('J')
  })
})
