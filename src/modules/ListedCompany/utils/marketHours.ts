export const INTRADAY_SESSION = {
  openHour: 9,
  openMinute: 0,
  closeHour: 13,
  closeMinute: 30
} as const

export function getIntradayTimeDomain(referenceDate: Date): [Date, Date] {
  const start = new Date(referenceDate)
  start.setHours(INTRADAY_SESSION.openHour, INTRADAY_SESSION.openMinute, 0, 0)
  const end = new Date(referenceDate)
  end.setHours(INTRADAY_SESSION.closeHour, INTRADAY_SESSION.closeMinute, 0, 0)
  return [start, end]
}

export function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return (
    hours >= INTRADAY_SESSION.openHour &&
    (hours < INTRADAY_SESSION.closeHour ||
      (hours === INTRADAY_SESSION.closeHour && minutes <= INTRADAY_SESSION.closeMinute))
  )
}
