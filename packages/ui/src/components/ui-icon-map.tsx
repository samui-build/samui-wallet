import {
  LucideAlertTriangle,
  LucideArrowDown,
  LucideArrowUp,
  LucideBookmarkMinus,
  LucideBookmarkPlus,
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
  LucideCopyCheck,
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
  LucideMoreVertical,
  LucideNetwork,
  LucideNotepadText,
  LucidePanelRight,
  LucidePanelRightClose,
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
  LucideX,
} from 'lucide-react'
import type * as react from 'react'
import type { ForwardRefExoticComponent } from 'react'

type UiIconLucide = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>

export type UiIconName =
  | 'add'
  | 'airdrop'
  | 'alert'
  | 'arrowDown'
  | 'arrowUp'
  | 'bookmarkAdd'
  | 'bookmarkRemove'
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
  | 'copyCheck'
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
  | 'menu'
  | 'mnemonic'
  | 'network'
  | 'plus'
  | 'portfolio'
  | 'refresh'
  | 'save'
  | 'search'
  | 'settings'
  | 'sidebar'
  | 'sidebarClose'
  | 'tools'
  | 'upload'
  | 'wallet'
  | 'watch'
  | 'x'

const uiIconMap = new Map<UiIconName, UiIconLucide>()
  .set('add', LucidePlus)
  .set('airdrop', LucideUmbrella)
  .set('alert', LucideAlertTriangle)
  .set('arrowDown', LucideArrowDown)
  .set('arrowUp', LucideArrowUp)
  .set('bookmarkAdd', LucideBookmarkPlus)
  .set('bookmarkRemove', LucideBookmarkMinus)
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
  .set('copyCheck', LucideCopyCheck)
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
  .set('menu', LucideMoreVertical)
  .set('mnemonic', LucideNotepadText)
  .set('network', LucideNetwork)
  .set('plus', LucidePlus)
  .set('portfolio', LucidePieChart)
  .set('refresh', LucideRefreshCcw)
  .set('save', LucideSave)
  .set('sidebar', LucidePanelRight)
  .set('sidebarClose', LucidePanelRightClose)
  .set('search', LucideSearch)
  .set('settings', LucideSettings)
  .set('tools', LucideHammer)
  .set('upload', LucideUploadCloud)
  .set('wallet', LucideWallet2)
  .set('watch', LucideEye)
  .set('x', LucideX)

export function getIcon(type: UiIconName) {
  if (!uiIconMap.has(type)) {
    throw new Error(`Icon with type ${type} not found`)
  }
  return uiIconMap.get(type) as UiIconLucide
}

export function getIconNames() {
  return Array.from(uiIconMap).map(([name]) => name)
}
