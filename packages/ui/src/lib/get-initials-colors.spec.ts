/*
 * From https://github.com/mantinedev/mantine and adapted for Tailwind
 * MIT License
 * Copyright (c) 2021 Vitaly Rtishchev
 */
import { describe, expect, it } from 'vitest'

import { getInitialsColor } from './get-initials-colors.ts'

describe('get-initials-color', () => {
  it('should return color based on initials', () => {
    expect(getInitialsColor('John Mol')).toStrictEqual({
      bg: 'bg-pink-100 dark:bg-pink-900',
      text: 'text-pink-800 dark:text-pink-300',
    })
    expect(getInitialsColor('John')).toStrictEqual({
      bg: 'bg-lime-100 dark:bg-lime-900',
      text: 'text-lime-800 dark:text-lime-300',
    })
    expect(getInitialsColor('Jane Doe')).toStrictEqual({
      bg: 'bg-indigo-100 dark:bg-indigo-900',
      text: 'text-indigo-800 dark:text-indigo-300',
    })
  })
})
