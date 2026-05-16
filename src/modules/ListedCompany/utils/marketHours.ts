export function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours >= 9 && (hours < 13 || (hours === 13 && minutes <= 30))
}
