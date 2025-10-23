export function ellipsify(str: string = '', len: number = 4, delimiter: string = '..'): string {
  if (!str || typeof str !== 'string') {
    return ''
  }
  const strLen = str.length
  const limit = len * 2 + delimiter.length
  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}
