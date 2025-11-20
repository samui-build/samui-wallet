import { install as installWebCryptoEd25519 } from '@solana/webcrypto-ed25519-polyfill'
import { install as installRNQuickCrypto } from 'react-native-quick-crypto'

installRNQuickCrypto()
installWebCryptoEd25519()
