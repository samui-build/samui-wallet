import { QRCode } from 'react-qrcode-logo'

export function UiQrCode({ content }: { content: string }) {
  return (
    <QRCode
      style={{
        height: '100%',
        width: '100%',
      }}
      value={content}
    />
  )
}
