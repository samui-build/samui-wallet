/*
 * From https://github.com/mantinedev/mantine and adapted for Tailwind
 * MIT License
 * Copyright (c) 2021 Vitaly Rtishchev
 */
function hashCode(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return hash
}

const colorMap: Record<UiColorName, UiColorPair> = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    border: 'border-blue-400 dark:border-blue-600',
    text: 'text-blue-800 dark:text-blue-300',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900',
    border: 'border-cyan-400 dark:border-cyan-600',
    text: 'text-cyan-800 dark:text-cyan-300',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900',
    border: 'border-green-400 dark:border-green-600',
    text: 'text-green-800 dark:text-green-300',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900',
    border: 'border-indigo-400 dark:border-indigo-600',
    text: 'text-indigo-800 dark:text-indigo-300',
  },
  lime: {
    bg: 'bg-lime-100 dark:bg-lime-900',
    border: 'border-lime-400 dark:border-lime-600',
    text: 'text-lime-800 dark:text-lime-300',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900',
    border: 'border-orange-400 dark:border-orange-600',
    text: 'text-orange-800 dark:text-orange-300',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900',
    border: 'border-pink-400 dark:border-pink-600',
    text: 'text-pink-800 dark:text-pink-300',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    border: 'border-purple-400 dark:border-purple-600',
    text: 'text-purple-800 dark:text-purple-300',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900',
    border: 'border-red-400 dark:border-red-600',
    text: 'text-red-800 dark:text-red-300',
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-900',
    border: 'border-teal-400 dark:border-teal-600',
    text: 'text-teal-800 dark:text-teal-300',
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-900',
    border: 'border-violet-400 dark:border-violet-600',
    text: 'text-violet-800 dark:text-violet-300',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    border: 'border-yellow-400 dark:border-yellow-600',
    text: 'text-yellow-800 dark:text-yellow-300',
  },
}

// These colors are sorted the same way as here https://tailwindcss.com/docs/colors
export const uiColorNames = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'purple',
  'pink',
] as const

export type UiColorName = (typeof uiColorNames)[number]

export interface UiColorPair {
  bg: string
  border: string
  text: string
}

export function getColorByName(colorName: UiColorName): UiColorPair {
  return colorMap[colorName]
}

export function getColorForName(name: string): UiColorName {
  const hash = hashCode(name)
  const index = Math.abs(hash) % uiColorNames.length

  return uiColorNames[index] as UiColorName
}
export function getInitialsColor(name: string): UiColorPair {
  return getColorByName(getColorForName(name))
}
