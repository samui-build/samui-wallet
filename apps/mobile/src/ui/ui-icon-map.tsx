import {
  LucideAlertTriangle,
  LucideArrowDown,
  LucideArrowUp,
  LucideBug,
  LucideCalendar,
  LucideCamera,
  LucideCheck,
  LucideCheckCircle,
  LucideChevronRight,
  LucideChevronsUpDown,
  LucideCircleX,
  LucideCoins,
  LucideCopy,
  LucideExternalLink,
  LucideEye,
  LucideGlobe,
  LucideHammer,
  LucideHandCoins,
  LucideHardDrive,
  LucideImage,
  LucideImport,
  LucideKeyRound,
  LucideLetterText,
  LucideNetwork,
  LucideNotepadText,
  LucidePencil,
  LucidePieChart,
  LucidePlus,
  type LucideProps,
  LucideRefreshCcw,
  LucideSave,
  LucideSearch,
  LucideSettings,
  LucideTrash,
  LucideUmbrella,
  LucideUploadCloud,
  LucideWallet2,
} from 'lucide-react-native'

import type { ForwardRefExoticComponent } from 'react'

type UiIconLucide = ForwardRefExoticComponent<LucideProps>

export type UiIconName =
  | 'add'
  | 'airdrop'
  | 'alert'
  | 'arrowDown'
  | 'arrowUp'
  | 'bug'
  | 'calendar'
  | 'camera'
  | 'check'
  | 'checkCircle'
  | 'chevronRight'
  | 'chevronsUpDown'
  | 'circleX'
  | 'coins'
  | 'copy'
  | 'delete'
  | 'derive'
  | 'edit'
  | 'explorer'
  | 'externalLink'
  | 'hammer'
  | 'handCoins'
  | 'hardware'
  | 'image'
  | 'import'
  | 'key'
  | 'mnemonic'
  | 'network'
  | 'portfolio'
  | 'refresh'
  | 'save'
  | 'search'
  | 'settings'
  | 'tools'
  | 'upload'
  | 'wallet'
  | 'watch'

const uiIconMap = new Map<UiIconName, UiIconLucide>()
  .set('add', LucidePlus)
  .set('airdrop', LucideUmbrella)
  .set('alert', LucideAlertTriangle)
  .set('arrowDown', LucideArrowDown)
  .set('arrowUp', LucideArrowUp)
  .set('bug', LucideBug)
  .set('calendar', LucideCalendar)
  .set('camera', LucideCamera)
  .set('check', LucideCheck)
  .set('checkCircle', LucideCheckCircle)
  .set('chevronRight', LucideChevronRight)
  .set('chevronsUpDown', LucideChevronsUpDown)
  .set('circleX', LucideCircleX)
  .set('coins', LucideCoins)
  .set('copy', LucideCopy)
  .set('delete', LucideTrash)
  .set('derive', LucideLetterText)
  .set('edit', LucidePencil)
  .set('explorer', LucideGlobe)
  .set('externalLink', LucideExternalLink)
  .set('hammer', LucideHammer)
  .set('handCoins', LucideHandCoins)
  .set('hardware', LucideHardDrive)
  .set('image', LucideImage)
  .set('import', LucideImport)
  .set('key', LucideKeyRound)
  .set('mnemonic', LucideNotepadText)
  .set('network', LucideNetwork)
  .set('portfolio', LucidePieChart)
  .set('refresh', LucideRefreshCcw)
  .set('save', LucideSave)
  .set('search', LucideSearch)
  .set('settings', LucideSettings)
  .set('tools', LucideHammer)
  .set('upload', LucideUploadCloud)
  .set('wallet', LucideWallet2)
  .set('watch', LucideEye)

export function getIcon(type: UiIconName) {
  if (!uiIconMap.has(type)) {
    throw new Error(`Icon with type ${type} not found`)
  }
  return uiIconMap.get(type) as UiIconLucide
}

export function getIconNames() {
  return Array.from(uiIconMap).map(([name]) => name)
}
