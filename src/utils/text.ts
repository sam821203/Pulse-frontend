/**
 * @description 取得文字寬度
 * @param text 文字
 * @param fontSize 字體大小
 * @returns 寬度
 */
export function getTextWidth(text: string, fontSize: number) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context !== null) {
    context.font = `${fontSize}px Noto Sans TC`
    return context.measureText(text).width
  }
  return 0
}

/**
 * @description 檢查文字是否超出寬度
 * @param text 文字
 * @param fontSize 字體大小
 * @param width 寬度
 * @returns 是否超出
 */
export function checkTextOverflow(text: string, fontSize: number, width: number) {
  const textWidth = getTextWidth(text, fontSize)
  return textWidth > width
}
