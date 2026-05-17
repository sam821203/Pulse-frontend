/** 台股漲跌停價：漲停 = 昨收 × 1.1、跌停 = 昨收 × 0.9，無條件捨去到 0.1 */
export function computeTaiwanLimitPrices(previousClose: number): {
  upLimit: number
  downLimit: number
} {
  const floorToTenth = (value: number) => Math.floor(value * 10) / 10
  return {
    upLimit: floorToTenth(previousClose * 1.1),
    downLimit: floorToTenth(previousClose * 0.9)
  }
}
