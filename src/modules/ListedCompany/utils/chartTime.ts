export type ChartRecordTuple = [
  date: string,
  time: string,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string
]

export interface ParsedChartPoint {
  time: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
  raw: ChartRecordTuple
}

function normalizeDate(date: string): string {
  return date.replace(/(\d{4})[/-]?(\d{2})[/-]?(\d{2})/, '$1-$2-$3')
}

function normalizeTime(time: string): string {
  const trimmed = time.trim()
  if (trimmed.includes(':')) return trimmed
  if (trimmed.length >= 6) {
    return `${trimmed.slice(0, 2)}:${trimmed.slice(2, 4)}:${trimmed.slice(4, 6)}`
  }
  if (trimmed.length >= 4) {
    return `${trimmed.slice(0, 2)}:${trimmed.slice(2, 4)}:00`
  }
  return trimmed
}

export function parseChartRecordTime(date: string, time: string): Date {
  const isoDate = normalizeDate(date)
  const isoTime = normalizeTime(time)
  const parsed = new Date(`${isoDate}T${isoTime}`)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

export function formatChartTooltip(row: ChartRecordTuple): string {
  const date = normalizeDate(row[0])
  return `${date} | 交易時間：${row[1]} | 開盤價: ${row[2]} | 最高價: ${row[3]} | 最低價: ${row[4]} | 目前成交價: ${row[5]} | 成交量: ${row[6]}`
}

export function formatIntradayTooltip(point: ParsedChartPoint): string {
  const time = normalizeTime(point.raw[1]).slice(0, 5)
  const price = Number.isFinite(point.close) ? point.close.toFixed(1) : '—'
  const volume = Number.isFinite(point.volume) ? String(Math.round(point.volume)) : '—'
  return `時間 ${time} | 價格 ${price} | 成交量 ${volume}`
}

export function buildIntradaySeries(rows: string[][]): ParsedChartPoint[] {
  return rows
    .map((row): ParsedChartPoint | null => {
      if (row.length < 7) return null
      const tuple = row as ChartRecordTuple
      const close = Number(tuple[5])
      if (!tuple[0] || !tuple[1] || Number.isNaN(close)) return null
      return {
        time: parseChartRecordTime(tuple[0], tuple[1]),
        open: Number(tuple[2]),
        high: Number(tuple[3]),
        low: Number(tuple[4]),
        close,
        volume: Number(tuple[6]) || 0,
        raw: tuple
      }
    })
    .filter((point): point is ParsedChartPoint => point !== null)
    .sort((a, b) => a.time.getTime() - b.time.getTime())
}
